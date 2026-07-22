'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeProps {
  onOpenComplete: () => void;
}

/* ── Tiny metal-strike spark particles ──────────────────────
   Pre-computed once in a ref so values never re-randomize.   */
type SparkData = {
  angle: number;   // radians
  dist: number;    // travel distance px
  dur: number;     // duration ms
  delay: number;   // stagger ms
};

function makeSparkData(count: number): SparkData[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6,
    dist: 30 + Math.random() * 55,
    dur: 220 + Math.random() * 180,
    delay: Math.random() * 60,
  }));
}

function MetalSparks({ sparks }: { sparks: SparkData[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[200] flex items-center justify-center overflow-visible">
      {sparks.map((s, i) => {
        const tx = Math.cos(s.angle) * s.dist;
        const ty = Math.sin(s.angle) * s.dist;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
            transition={{
              duration: s.dur / 1000,
              delay: s.delay / 1000,
              ease: [0.2, 0.8, 0.4, 1],
            }}
            className="absolute block rounded-full bg-white"
            style={{
              width: '3px',
              height: '3px',
              boxShadow: '0 0 4px 1px rgba(255, 230, 80, 1), 0 0 8px 2px rgba(255, 200, 0, 0.6)',
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function Envelope({ onOpenComplete }: EnvelopeProps) {
  const [phase, setPhase] = useState<'idle' | 'sparking' | 'opening' | 'done'>('idle');
  const sparksRef = useRef<SparkData[]>(makeSparkData(14));

  const handleOpen = () => {
    if (phase !== 'idle') return;

    // Regenerate fresh spark data each tap
    sparksRef.current = makeSparkData(14);

    setPhase('sparking');

    // After sparks (~300ms), start doors
    setTimeout(() => setPhase('opening'), 280);

    // Complete after door animation
    setTimeout(() => {
      setPhase('done');
      onOpenComplete();
    }, 1850);
  };

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto">

      {/* ── Left Door ─────────────────────────────────────────── */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: phase === 'opening' ? '-100%' : 0 }}
        transition={{ type: 'spring', bounce: 0.04, duration: 1.5, delay: 0.12 }}
        className="absolute left-0 top-0 bottom-0 w-1/2 z-20 flex justify-end"
        style={{
          background: '#121110',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          boxShadow: phase === 'opening' ? '12px 0 40px rgba(0,0,0,0.9)' : 'none',
        }}
      >
        <div
          className="w-[1px] h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #D4AF37 40%, #F4D084 50%, #D4AF37 60%, transparent 100%)',
            boxShadow: '-3px 0 18px rgba(212,175,55,0.35)',
            opacity: 0.8,
          }}
        />
      </motion.div>

      {/* ── Right Door ────────────────────────────────────────── */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: phase === 'opening' ? '100%' : 0 }}
        transition={{ type: 'spring', bounce: 0.04, duration: 1.5, delay: 0.12 }}
        className="absolute right-0 top-0 bottom-0 w-1/2 z-20 flex justify-start"
        style={{
          background: '#121110',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          boxShadow: phase === 'opening' ? '-12px 0 40px rgba(0,0,0,0.9)' : 'none',
        }}
      >
        <div
          className="w-[1px] h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #D4AF37 40%, #F4D084 50%, #D4AF37 60%, transparent 100%)',
            boxShadow: '3px 0 18px rgba(212,175,55,0.35)',
            opacity: 0.8,
          }}
        />
      </motion.div>

      {/* ── Metal-Strike Sparks ────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'sparking' && (
          <MetalSparks sparks={sparksRef.current} />
        )}
      </AnimatePresence>

      {/* ── Wax Seal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.button
            onClick={handleOpen}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0, filter: 'blur(5px)', transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
            whileTap={{ scale: 0.88 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] bg-transparent border-0 p-0 cursor-pointer"
            aria-label="Open invitation"
          >
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(212,175,55,0.4)' }}
              animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(212,175,55,0.2)' }}
              animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
            />

            {/* Seal */}
            <div className="relative w-[128px] h-[128px] md:w-[150px] md:h-[150px] flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full"
                style={{
                  filter:
                    'drop-shadow(0 16px 30px rgba(0,0,0,0.85)) drop-shadow(0 4px 10px rgba(0,0,0,0.6))',
                }}
              >
                <defs>
                  <radialGradient id="wg2" cx="33%" cy="28%" r="72%">
                    <stop offset="0%"   stopColor="#C0392B" />
                    <stop offset="30%"  stopColor="#8B1A10" />
                    <stop offset="65%"  stopColor="#5C0F08" />
                    <stop offset="100%" stopColor="#2E0A05" />
                  </radialGradient>
                  <radialGradient id="wh2" cx="38%" cy="30%" r="55%">
                    <stop offset="0%"   stopColor="rgba(255,200,180,0.22)" />
                    <stop offset="100%" stopColor="rgba(255,200,180,0)" />
                  </radialGradient>
                  <filter id="we2" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000" floodOpacity="0.75" />
                    <feDropShadow dx="-2" dy="-2" stdDeviation="3" floodColor="#fff" floodOpacity="0.12" />
                  </filter>
                </defs>
                <path
                  d="M100 11C126 9 155 24 170 48C187 74 191 104 184 130C177 156 160 175 136 187C112 199 83 197 59 184C33 169 14 146 10 119C5 91 17 63 35 43C56 20 74 13 100 11Z"
                  fill="url(#wg2)" filter="url(#we2)"
                />
                <circle cx="100" cy="100" r="70" stroke="rgba(255,180,150,0.25)" strokeWidth="1.2" fill="none" strokeDasharray="4 3" />
                <circle cx="100" cy="100" r="60" stroke="rgba(255,160,130,0.15)" strokeWidth="0.8" fill="none" />
                <ellipse cx="78" cy="62" rx="38" ry="22" fill="url(#wh2)" transform="rotate(-12 78 62)" />
              </svg>

              {/* Pulsing label */}
              <motion.div
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="relative z-10 text-center select-none"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  color: '#F4D084',
                  textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 12px rgba(244,208,132,0.4)',
                  lineHeight: 1.5,
                }}
              >
                TAP TO<br />OPEN
              </motion.div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
