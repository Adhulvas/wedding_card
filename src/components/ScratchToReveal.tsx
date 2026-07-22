'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ScratchCard = ({ onReveal }: { onReveal: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let initialOpaquePixels = -1;

    const fillCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      if (canvas.width === 0 || canvas.height === 0) return;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      const w = canvas.width;
      const h = canvas.height;

      const heartPath = new Path2D();
      heartPath.moveTo(w * 0.5, h * 0.25);
      heartPath.bezierCurveTo(w * 0.5, 0, 0, 0, 0, h * 0.35);
      heartPath.bezierCurveTo(0, h * 0.65, w * 0.5, h * 0.85, w * 0.5, h);
      heartPath.bezierCurveTo(w * 0.5, h * 0.85, w, h * 0.65, w, h * 0.35);
      heartPath.bezierCurveTo(w, 0, w * 0.5, 0, w * 0.5, h * 0.25);

      ctx.clip(heartPath);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FFF5C3');
      gradient.addColorStop(0.2, '#E4C15A');
      gradient.addColorStop(0.5, '#D4AF37');
      gradient.addColorStop(0.8, '#AA771C');
      gradient.addColorStop(1, '#5C3905');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(107, 68, 11, 0.4)';
      ctx.lineWidth = 4;
      ctx.stroke(heartPath);

      ctx.save();
      ctx.translate(w * 0.05, h * 0.05);
      ctx.scale(0.9, 0.9);
      ctx.strokeStyle = 'rgba(255, 245, 195, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke(heartPath);
      ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      for (let i = 0; i < 400; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(107, 68, 11, 0.6)';
      ctx.shadowBlur = 4;

      // Determine font size based on canvas width
      const fontSize = canvas.width < 300 ? 18 : 22;
      ctx.font = `bold ${fontSize}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Shift text slightly above center because visual center of heart is higher
      ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height * 0.42);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      ctx.restore();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let opaque = 0;
      for (let i = 3; i < pixels.length; i += 4 * 10) {
        if (pixels[i] >= 128) opaque++;
      }
      initialOpaquePixels = opaque;
    };

    fillCanvas();

    const handleResize = () => {
      fillCanvas();
    };
    window.addEventListener('resize', handleResize);

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if (window.TouchEvent && e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const { x, y } = getMousePos(e);
      lastX = x;
      lastY = y;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      if (e.cancelable) {
        e.preventDefault();
      }

      const { x, y } = getMousePos(e);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.lineWidth = 40; // Brush size
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastX = x;
      lastY = y;

      checkReveal();
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    const checkReveal = () => {
      if (revealedRef.current || initialOpaquePixels === -1) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let opaque = 0;
      for (let i = 3; i < pixels.length; i += 4 * 10) {
        if (pixels[i] >= 128) opaque++;
      }

      if (opaque < initialOpaquePixels * 0.4) {
        revealedRef.current = true;
        setIsRevealed(true);
        onReveal();
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isRevealed, onReveal]);

  return (
    <div className="w-full flex justify-center items-center py-4">
      {/* SVG Clip Path Definition for Heart */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5 0.25 C 0.5 0, 0 0, 0 0.35 C 0 0.65, 0.5 0.85, 0.5 1 C 0.5 0.85, 1 0.65, 1 0.35 C 1 0, 0.5 0, 0.5 0.25 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative w-[280px] sm:w-[340px] md:w-[400px] h-[280px] sm:h-[340px] md:h-[400px] flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(140,98,18,0.25)]">
        {/* Background Card */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#ffffff] via-[#fcfaf7] to-[#f5ead6]"
          style={{ clipPath: 'url(#heart-clip)' }}
        >
          {/* Inner fancy border using SVG so it follows the heart shape */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 50 25 C 50 0, 0 0, 0 35 C 0 65, 50 85, 50 100 C 50 85, 100 65, 100 35 C 100 0, 50 0, 50 25 Z"
              fill="none"
              stroke="rgba(170, 119, 28, 0.25)"
              strokeWidth="2"
              transform="scale(0.9) translate(5.5, 5.5)"
            />
            <path
              d="M 50 25 C 50 0, 0 0, 0 35 C 0 65, 50 85, 50 100 C 50 85, 100 65, 100 35 C 100 0, 50 0, 50 25 Z"
              fill="none"
              stroke="rgba(170, 119, 28, 0.15)"
              strokeWidth="1"
              transform="scale(0.8) translate(12.5, 12.5)"
            />
          </svg>
        </div>

        {/* Revealed Content */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center select-none z-10 pb-16 sm:pb-20 pt-2 sm:pt-4"
          style={{ clipPath: 'url(#heart-clip)' }}
        >
          <div className="flex flex-col justify-center items-center scale-[0.75] sm:scale-90 md:scale-100">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-romantic text-2xl sm:text-5xl md:text-4xl text-[#aa251c] mb-1 sm:mb-2 drop-shadow-sm whitespace-nowrap"
            >
              You're Invited
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-serif text-sm sm:text-xl md:text-lg text-[#8C6212] font-bold mb-2 sm:mb-3 tracking-[0.2em] sm:tracking-widest uppercase whitespace-nowrap"
            >
              August 23, 2026
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-2 sm:gap-3 w-[80%] mx-auto mb-2 sm:mb-3"
            >
              <div className="h-[1px] bg-gradient-to-r from-transparent to-[#aa251c]/40 flex-1" />
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rotate-45 bg-[#aa251c]/60 shrink-0" />
              <div className="h-[1px] bg-gradient-to-l from-transparent to-[#aa251c]/40 flex-1" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="font-sans text-[#aa251c]/90 uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[9px] sm:text-[12px] md:text-xs font-bold whitespace-nowrap"
            >
              Sunday, 10:30 AM
            </motion.p>
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full z-20" style={{ clipPath: 'url(#heart-clip)' }}>
          <AnimatePresence>
            {!isRevealed && (
              <motion.canvas
                ref={canvasRef}
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="w-full h-full cursor-pointer touch-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Border sweep highlight — activates after reveal */}
        {isRevealed && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="glow-filter">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Static glowing border */}
            <path
              d="M 50 25 C 50 0, 0 0, 0 35 C 0 65, 50 85, 50 100 C 50 85, 100 65, 100 35 C 100 0, 50 0, 50 25 Z"
              fill="none"
              stroke="rgba(180, 19, 27, 0.45)"
              strokeWidth="1.5"
            />

            {/* Traveling highlight sweep */}
            <path
              d="M 50 25 C 50 0, 0 0, 0 35 C 0 65, 50 85, 50 100 C 50 85, 100 65, 100 35 C 100 0, 50 0, 50 25 Z"
              fill="none"
              stroke="url(#sweep-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-filter)"
              strokeDasharray="20 300"
              style={{
                animation: 'border-sweep 2.5s linear infinite',
              }}
            />

            <defs>
              <linearGradient id="sweep-grad" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,245,195,0)" />
                <stop offset="40%" stopColor="rgba(255,220,100,1)" />
                <stop offset="60%" stopColor="rgba(255,255,255,1)" />
                <stop offset="100%" stopColor="rgba(255,245,195,0)" />
              </linearGradient>
            </defs>

            <style>{`
              @keyframes border-sweep {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -320; }
              }
            `}</style>
          </svg>
        )}
      </div>
    </div>
  );
};

function fireConfettiBurst() {
  const colors = ['#D4AF37', '#AA771C', '#FFF5C3', '#FFD700', '#E4C15A', '#ffffff', '#FFB6C1'];

  // Left blast
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.7 },
    colors,
    startVelocity: 45,
    gravity: 0.9,
    scalar: 1.1,
  });

  // Right blast
  confetti({
    particleCount: 100,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.7 },
    colors,
    startVelocity: 45,
    gravity: 0.9,
    scalar: 1.1,
  });

  // Center blast
  confetti({
    particleCount: 60,
    angle: 90,
    spread: 100,
    origin: { x: 0.5, y: 0.4 },
    colors,
    startVelocity: 35,
    gravity: 1.0,
    scalar: 1.2,
  });
}

export default function ScratchToReveal() {
  const handleReveal = useCallback(() => {
    fireConfettiBurst();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-24 sm:py-32 px-4 relative z-20 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-200/20 rounded-full blur-[80px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center space-y-3 mb-8"
      >
        <h2 className="heading-romantic text-4xl sm:text-5xl">Save the Date</h2>
        <div className="flex items-center justify-center gap-3 w-64 md:w-80 mx-auto mt-4 mb-8">
          <div className="h-[1.5px] bg-gradient-to-r from-transparent to-[#D4AF37]/60 flex-1" />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-[#aa251c]"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
          <div className="h-[1.5px] bg-gradient-to-l from-transparent to-[#D4AF37]/60 flex-1" />
        </div>
      </motion.div>

      <div className="w-full flex justify-center items-center px-2">
        <ScratchCard onReveal={handleReveal} />
      </div>
    </div>
  );
}
