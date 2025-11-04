import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  startRef: React.RefObject<HTMLElement>;
  src?: string;
  speed?: number;     // px/s
  widthPx?: number;   // px
};

export default function RoombaOverlay({
  startRef,
  src = '/roomba.png',
  speed = 10,
  widthPx = 10,
}: Props) {
  const botRef = useRef<HTMLImageElement | null>(null);

  const halfW = useRef(0);
  const halfH = useRef(0);
  const angleRef = useRef(0);
  const angleTargetRef = useRef(0);

  const cursorRef = useRef<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const isActive = useRef(true); 

   useLayoutEffect(() => {
    const bot = botRef.current;
    if (bot) bot.style.visibility = 'hidden';
  }, []);

   useLayoutEffect(() => {
    const bot = botRef.current;
    if (!bot) return;

    function computeHalf() {
      const natW = bot.naturalWidth || 1;
      const natH = bot.naturalHeight || 1;
      const scale = (widthPx ?? 120) / natW;
      halfW.current = (natW * scale) / 2;
      halfH.current = (natH * scale) / 2;
    }

    if (bot.complete) computeHalf();
    else {
      bot.onload = computeHalf;
      bot.onerror = computeHalf;
    }
  }, [widthPx]);

  useLayoutEffect(() => {
    const bot = botRef.current;
    if (!bot) return;

    let cancelled = false;

    function place() {
      if (cancelled) return;
      const el = startRef.current;
      if (!el) {
        requestAnimationFrame(place);
        return;
      }

      const r = el.getBoundingClientRect();
      const startCx = r.left - 40;
      const startCy = r.top + r.height * 0.5 - 30;
      const startX = startCx - halfW.current;
      const startY = startCy - halfH.current;

      const dx0 = cursorRef.current.x - startCx;
      const dy0 = cursorRef.current.y - startCy;
      const a0 = Math.atan2(dy0, dx0);

      angleRef.current = a0;
      angleTargetRef.current = a0;

      bot.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${angleRef.current + OFFSET_RAD}rad)`;
      bot.style.visibility = 'visible';
    }

    const ensureHalfAndPlace = () => {
      if (halfW.current === 0 || halfH.current === 0) {
        requestAnimationFrame(ensureHalfAndPlace);
      } else {
        place();
      }
    };
    ensureHalfAndPlace();

    return () => { cancelled = true; };
  }, [startRef, widthPx]);

  useEffect(() => {
    const bot = botRef.current;
    if (!bot) return;

    let raf = 0;
    let last = performance.now();

    const pos = { x: 0, y: 0 };
    {
      const m = /translate3d\(([-\d.]+)px,\s*([-\d.]+)px/i.exec(bot.style.transform || '');
      if (m) {
        pos.x = parseFloat(m[1]);
        pos.y = parseFloat(m[2]);
      }
    }

       function onPointerMove(e: PointerEvent) {
      if (!isActive.current) return; // só atualiza se estiver dentro
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    }

    function onMouseEnter() {
      isActive.current = true;
    }

    function onMouseLeave() {
      isActive.current = false;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);

    function clamp(v: number, a: number, b: number) {
      return Math.max(a, Math.min(b, v));
    }
    function shortestDelta(curr: number, targ: number) {
      let d = targ - curr;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      return d;
    }

     function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (isActive.current) {
        const targetTopLeftX = cursorRef.current.x - halfW.current;
        const targetTopLeftY = cursorRef.current.y - halfH.current;
        const dx = targetTopLeftX - pos.x;
        const dy = targetTopLeftY - pos.y;
        const dist = Math.hypot(dx, dy);

        if (dist > POS_EPS) {
          const step = Math.min((speed ?? 240) * dt, dist);
          pos.x += (dx / dist) * step;
          pos.y += (dy / dist) * step;
          bot.classList.add('moving');
        } else {
          pos.x = targetTopLeftX;
          pos.y = targetTopLeftY;
          bot.classList.remove('moving');
        }

        const cx = pos.x + halfW.current;
        const cy = pos.y + halfH.current;
        const vdx = cursorRef.current.x - cx;
        const vdy = cursorRef.current.y - cy;
        const distToCursor = Math.hypot(vdx, vdy);

        if (distToCursor > ANGLE_FREEZE_DIST) {
          angleTargetRef.current = Math.atan2(vdy, vdx);
        }

        const distFactor = clamp(distToCursor / TURN_DIST_REF, 0, 1);
        const tau = TAU_NEAR + (TAU_FAR - TAU_NEAR) * (1 - distFactor);
        const alpha = 1 - Math.exp(-dt / tau);

        const turnRateDeg =
          MAX_TURN_RATE_DEG_NEAR +
          (MAX_TURN_RATE_DEG_FAR - MAX_TURN_RATE_DEG_NEAR) * distFactor;
        const maxTurn = (turnRateDeg * DEG2RAD) * dt;

        const delta = shortestDelta(angleRef.current, angleTargetRef.current);
        let turn = delta * alpha;
        turn = clamp(turn, -maxTurn, maxTurn);
        angleRef.current += turn;
      }

      bot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angleRef.current + OFFSET_RAD}rad)`;

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame((t) => {
      last = t;
      raf = requestAnimationFrame(loop);
    });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, [speed, widthPx]);

  return createPortal(
    <img
      ref={botRef}
      className="roomba-bot roomba-fixed"
      src={src}
      alt="Roomba bot following cursor"
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

const OFFSET_RAD = (90 * Math.PI) / 180;
const POS_EPS = 0.6;
const TURN_DIST_REF = 5;
const TAU_NEAR = 0.01;
const TAU_FAR = 0.01;
const MAX_TURN_RATE_DEG_NEAR = 50;
const MAX_TURN_RATE_DEG_FAR = 50;
const ANGLE_FREEZE_DIST = 4;
const DEG2RAD = Math.PI / 180;
