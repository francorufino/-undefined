// src/components/RoombaOverlay.tsx
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  startRef: React.RefObject<HTMLElement>;
  src?: string;
  speed?: number;     // px/s (linear)
  widthPx?: number;   // px (largura renderizada)
};

export default function RoombaOverlay({
  startRef,
  src = '/roomba.png',
  speed = 10,
  widthPx = 10,
}: Props) {
  const botRef = useRef<HTMLImageElement | null>(null);

  // Centro do bot (para colisão com viewport)
  const pos = useRef<{ cx: number; cy: number }>({ cx: 0, cy: 0 });

  // Metade do tamanho renderizado
  const halfW = useRef(0);
  const halfH = useRef(0);

  // Ângulos (radianos). IMPORTANTE: não normalizamos (mantemos acumulado).
  const angle = useRef(0);         // orientação atual
  const angleTarget = useRef(0);   // orientação alvo (acumulada)

  // Estado
  const mode = useRef<'init' | 'move' | 'rotate'>('init');

  /* ---------- init visual ---------- */
  useLayoutEffect(() => {
    const bot = botRef.current;
    if (bot) bot.style.visibility = 'hidden';
  }, []);

  // calcula halfW/halfH
  useLayoutEffect(() => {
    const bot = botRef.current;
    if (!bot) return;

    function computeHalf() {
      const natW = bot.naturalWidth || 1;
      const natH = bot.naturalHeight || 1;
      const scale = (widthPx ?? 10) / natW;
      halfW.current = (natW * scale) / 2;
      halfH.current = (natH * scale) / 2;
    }

    if (bot.complete) computeHalf();
    else {
      bot.onload = computeHalf;
      bot.onerror = computeHalf;
    }
  }, [widthPx]);

  // posiciona inicial e heading
  useLayoutEffect(() => {
    const bot = botRef.current;
    if (!bot) return;

    let cancelled = false;

    const place = () => {
      if (cancelled) return;
      const el = startRef.current;
      if (!el || !halfW.current || !halfH.current) {
        requestAnimationFrame(place);
        return;
      }

      const r = el.getBoundingClientRect();
      const startCx = r.left - 40;
      const startCy = r.top + r.height * 0.5 - 30;

      const cx = clamp(startCx, halfW.current, window.innerWidth  - halfW.current);
      const cy = clamp(startCy, halfH.current, window.innerHeight - halfH.current);

      pos.current = { cx, cy };

      // Ângulo inicial apontando para dentro (valor dentro de [-π, π] só no start)
      const a0 = pickInwardAngle(cx, cy);
      angle.current = a0;
      angleTarget.current = a0;
      mode.current = 'move';

      applyTransform();
      bot.style.visibility = 'visible';
    };

    place();

    return () => { cancelled = true; };
  }, [startRef, widthPx]);

  /* ---------- loop ---------- */
  useEffect(() => {
    const bot = botRef.current;
    if (!bot) return;

    let raf = 0;
    let last = performance.now();

    function onResize() {
      const { cx, cy } = pos.current;
      pos.current.cx = clamp(cx, halfW.current, window.innerWidth  - halfW.current);
      pos.current.cy = clamp(cy, halfH.current, window.innerHeight - halfH.current);
      applyTransform();
    }
    window.addEventListener('resize', onResize);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (mode.current === 'move') {
        stepMove(dt);
      } else if (mode.current === 'rotate') {
        stepRotateCWAccum(dt); // gira sempre clockwise até atingir o alvo acumulado
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame((t) => { last = t; raf = requestAnimationFrame(tick); });

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [speed, widthPx]);

  /* ---------- movimento retilíneo ---------- */
  function stepMove(dt: number) {
    const v = speed ?? 10;
    const dirX = Math.cos(angle.current);
    const dirY = Math.sin(angle.current);

    let nx = pos.current.cx + dirX * v * dt;
    let ny = pos.current.cy + dirY * v * dt;

    let hit: 'left' | 'right' | 'top' | 'bottom' | null = null;

    if (nx <= halfW.current) { nx = halfW.current; hit = 'left'; }
    else if (nx >= window.innerWidth - halfW.current) { nx = window.innerWidth - halfW.current; hit = 'right'; }

    if (ny <= halfH.current) { ny = halfH.current; hit = hit ?? 'top'; }
    else if (ny >= window.innerHeight - halfH.current) { ny = window.innerHeight - halfH.current; hit = hit ?? 'bottom'; }

    pos.current.cx = nx;
    pos.current.cy = ny;
    applyTransform();

    if (hit) {
      // Sem reset: soma SEMPRE +75° ao alvo acumulado (clockwise)
      angleTarget.current = angleTarget.current + ROTATE_STEP_RAD;
      mode.current = 'rotate';
    }
  }

  /* ---------- rotação parada sempre clockwise acumulada ---------- */
  function stepRotateCWAccum(dt: number) {
    // resto a girar (sempre positivo, porque alvo só cresce)
    const remaining = angleTarget.current - angle.current;

    // quando falta ~1°, termina
    if (remaining <= (1 * DEG2RAD)) {
      angle.current = angleTarget.current;
      mode.current = 'move';
      applyTransform();
      return;
    }

    // passo máximo por frame (deg/s -> rad/frame)
    const maxTurn = (MAX_TURN_RATE_DEG_NEAR * DEG2RAD) * dt;

    // avança no sentido horário (positivo) sem NUNCA inverter
    const step = Math.min(remaining, maxTurn);
    angle.current = angle.current + step;

    applyTransform();
  }

  /* ---------- transform ---------- */
  function applyTransform() {
    const bot = botRef.current;
    if (!bot) return;
    const x = pos.current.cx - halfW.current;
    const y = pos.current.cy - halfH.current;
    // Usamos angle acumulado diretamente; CSS lida com ângulos grandes.
    bot.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle.current + OFFSET_RAD}rad)`;
  }

  /* ---------- util ---------- */
  function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

  function normalizeAngle(a: number) {
    while (a <= -Math.PI) a += 2 * Math.PI;
    while (a >   Math.PI) a -= 2 * Math.PI;
    return a;
  }

  // ângulo inicial “para dentro” do viewport
  function pickInwardAngle(cx: number, cy: number): number {
    const leftD   = cx - halfW.current;
    const rightD  = (window.innerWidth  - halfW.current) - cx;
    const topD    = cy - halfH.current;
    const bottomD = (window.innerHeight - halfH.current) - cy;

    const horizBase = rightD >= leftD ? 0 : Math.PI;            // +X ou -X
    const vertBase  = bottomD >= topD ? Math.PI/2 : -Math.PI/2; // +Y ou -Y

    const base = Math.random() < 0.5 ? horizBase : vertBase;
    const jitter = (Math.random() - 0.5) * Math.PI; // ±90°
    return normalizeAngle(base + jitter);
  }

  /* ---------- render ---------- */
  return createPortal(
    <img
      ref={botRef}
      className="roomba-bot roomba-fixed"
      src={src}
      alt="Roomba wandering"
      draggable={false}
      style={{
        width: `${widthPx}px`,
        height: 'auto',
        top: 0,
        left: 0,
        position: 'fixed',
        transformOrigin: '50% 50%',
      }}
    />,
    document.body
  );
}

/* ================== PARÂMETROS (mantendo seus presets) ================== */
const OFFSET_RAD = (90 * Math.PI) / 180; // frente → direita
const POS_EPS = 0.6;

const TURN_DIST_REF = 5;         // mantido (não usado aqui)
const TAU_NEAR = 0.01;           // mantido (não usado aqui)
const TAU_FAR  = 0.01;           // mantido (não usado aqui)
const MAX_TURN_RATE_DEG_NEAR = 50; // deg/s para rotação parada
const MAX_TURN_RATE_DEG_FAR  = 50; // mantido
const ANGLE_FREEZE_DIST = 4;       // mantido

const ROTATE_STEP_DEG = 75;
const ROTATE_STEP_RAD = (ROTATE_STEP_DEG * Math.PI) / 180;

const DEG2RAD = Math.PI / 180;
