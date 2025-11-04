import React, { useRef } from 'react';
import './Home.css';
import RoombaOverlay from '../../components/RoombaOverlay';

export default function Home() {
  const heroTextRef = useRef<HTMLDivElement | null>(null);

  return (
    <main>
      <div className="home">
        <section className="heroSection">
          <section className="hero">
            <div ref={heroTextRef}>
              <h1>
                Welcome to <span className="green">!</span>
                <span className="pink">Undefined</span>
              </h1>
              <p>Innovation meets creativity — powered by AI.</p>
              <button className="cta">Explore</button>
            </div>
            <div>
              <img
                src="/HomePageGraphic.png"
                alt="!Undefined Logo"
                className="heroRobot"
              />
            </div>
          </section>
        </section>

        <section className="features">
          <h2>Updates for your</h2>
          <div className="feature-list">
            <article className="feature-item">
              <h3>Humanoid Robot</h3>
              <p>Smart recommendations using machine learning models.</p>
            </article>
            <article className="feature-item">
              <h3>Pet Robot</h3>
              <p>Customize your style and sync with backend APIs.</p>
            </article>
            <article className="feature-item">
              <h3>Vacuum Robot</h3>
              <p>Modern authentication ready for integration.</p>
            </article>
          </div>
        </section>

        {/* Overlay global do Roomba (depois do heroTextRef estar montado) */}
        <RoombaOverlay startRef={heroTextRef} src="/roomba.png" speed={280} widthPx={200} />
      </div>
    </main>
  );
}
