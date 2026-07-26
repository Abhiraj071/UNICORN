import { useState, useEffect, useRef } from 'react';
import './LaunchCountdown.css';

const LaunchCountdown = ({ onEnterStore }) => {
  // Target Launch Date: July 26, 2026 at 7:00 PM IST (19:00:00)
  const getTargetDate = () => {
    // 2026-07-26T19:00:00+05:30
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

    const particleCount = Math.min(50, Math.floor(width / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      color: Math.random() > 0.3 ? '#8ab897' : '#d4a359',
      opacity: Math.random() * 0.7 + 0.2,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
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
        ctx.shadowBlur = 8;
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
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="launch-canvas" />

      {/* SVG Luxury Arch Graphics */}
      <svg className="launch-arches-bg" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 800 A 300 400 0 0 1 700 800" stroke="#8ab897" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.35" />
        <path d="M 160 800 A 240 340 0 0 1 640 800" stroke="#d4a359" strokeWidth="0.75" opacity="0.25" />
        <path d="M 220 800 A 180 280 0 0 1 580 800" stroke="#8ab897" strokeWidth="0.5" opacity="0.2" />
        <path d="M 280 800 A 120 220 0 0 1 520 800" stroke="#d4a359" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
      </svg>

      {/* Content Overlay */}
      <div className="launch-content">
        {/* Diamond Line Ornament */}
        <div className="launch-ornament">
          <span className="launch-ornament-line"></span>
          <span className="launch-ornament-diamond">◆</span>
          <span className="launch-ornament-line"></span>
        </div>

        {/* Title */}
        <div className="launch-title-wrapper">
          <h1 className="launch-title">
            UNICORN <span className="launch-title-onyx">ONYX</span>
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

        {/* Footer Announcement */}
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

      {/* Admin / Tester Preview Bypass Button */}
      <button onClick={onEnterStore} className="launch-bypass-btn">
        ENTER STORE (PREVIEW)
      </button>
    </div>
  );
};

export default LaunchCountdown;
