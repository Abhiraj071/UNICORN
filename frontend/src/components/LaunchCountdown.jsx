import { useState, useEffect, useRef } from 'react';
import './LaunchCountdown.css';

const LaunchCountdown = ({ onEnterStore }) => {
  // Target Launch Date: July 26, 2026 at 7:00 PM IST (19:00:00)
  const getTargetDate = () => {
    return new Date('2026-07-26T19:00:00+05:30').getTime();
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    const target = getTargetDate();
    const now = Date.now();
    return Math.max(0, target - now);
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    const targetTime = getTargetDate();

    const interval = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Floating particles canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(55, Math.floor(width / 25));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      color: Math.random() > 0.35 ? '#8ab897' : '#d4a359',
      opacity: Math.random() * 0.75 + 0.2,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.25,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, '0');
  const isLaunched = timeLeft <= 0;

  return (
    <div className="launch-container fade-in">
      {/* Background Floating Particle Canvas */}
      <canvas ref={canvasRef} className="launch-canvas" />

      {/* SVG Luxury Arch Background */}
      <svg className="launch-arches-bg" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 1000 A 450 650 0 0 1 950 1000" stroke="#8ab897" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.28" />
        <path d="M 120 1000 A 380 570 0 0 1 880 1000" stroke="#d4a359" strokeWidth="0.8" opacity="0.22" />
        <path d="M 190 1000 A 310 490 0 0 1 810 1000" stroke="#8ab897" strokeWidth="0.6" opacity="0.18" />
        <path d="M 260 1000 A 240 410 0 0 1 740 1000" stroke="#d4a359" strokeWidth="0.6" strokeDasharray="4 4" opacity="0.25" />
      </svg>

      {/* Content Layer */}
      <div className="launch-content">
        {/* Diamond Line Ornament */}
        <div className="launch-ornament">
          <span className="launch-ornament-line"></span>
          <span className="launch-ornament-diamond">◆</span>
          <span className="launch-ornament-line"></span>
        </div>

        {/* Brand Title - Single Line UNICORN ONYX */}
        <div className="launch-title-wrapper">
          <h1 className="launch-title">
            <span className="launch-title-unicorn">UNICORN</span>
            <span className="launch-title-onyx">ONYX</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="launch-subtitle">NOT MADE FOR EVERYONE</p>

        {/* Countdown Box */}
        <div className="launch-timer-box">
          <div className="launch-timer-grid">
            <div className="launch-timer-unit">
              <span className="launch-timer-number">{pad(hours)}</span>
              <span className="launch-timer-label">HOURS</span>
            </div>
            <span className="launch-timer-separator">:</span>
            <div className="launch-timer-unit">
              <span className="launch-timer-number">{pad(minutes)}</span>
              <span className="launch-timer-label">MINUTES</span>
            </div>
            <span className="launch-timer-separator">:</span>
            <div className="launch-timer-unit">
              <span className="launch-timer-number">{pad(seconds)}</span>
              <span className="launch-timer-label">SECONDS</span>
            </div>
          </div>
        </div>

        {/* Footer Launch Date */}
        {isLaunched ? (
          <button onClick={onEnterStore} className="launch-unveil-btn glow-effect">
            ENTER UNICORN ONYX STORE
          </button>
        ) : (
          <div className="launch-footer-text">
            LAUNCHING JULY 26, 2026, 7:00 PM
          </div>
        )}
      </div>

      {/* Secret / Tester Preview Bypass Button */}
      <button onClick={onEnterStore} className="launch-bypass-btn">
        ENTER STORE (PREVIEW)
      </button>
    </div>
  );
};

export default LaunchCountdown;
