'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const targetDate = new Date('2026-08-23T10:30:00+05:30'); // Indian Standard Time

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isMounted) {
    // Return a static placeholder structure during SSR to avoid hydration mismatch
    return (
      <div className="flex justify-center items-center space-x-3 md:space-x-6 py-6 opacity-0">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
          <div key={label} className="w-16 h-20 md:w-24 md:h-28 flex flex-col justify-center items-center" />
        ))}
      </div>
    );
  }

  const timeItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        className="text-center w-full"
      >
        <h2 className="heading-romantic text-4xl sm:text-5xl">Counting Down to Forever</h2>

        <div className="flex items-center justify-center gap-3 w-64 md:w-80 mx-auto mt-4 mb-8">
          <div className="h-[1.5px] bg-gradient-to-r from-transparent to-[#D4AF37]/60 flex-1" />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-[#aa251c]"
          >
            <svg
              className="w-2 h-2 md:w-4 md:h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
          <div className="h-[1.5px] bg-gradient-to-l from-transparent to-[#D4AF37]/60 flex-1" />
        </div>

        <div className="flex justify-center items-center space-x-3 md:space-x-6">
          {timeItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, rotateX: -90, y: 20, transformPerspective: 800 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.8, type: 'spring', bounce: 0.3 }}
              style={{ transformOrigin: 'top center' }}
              className="relative w-18 h-20 md:w-24 md:h-28 rounded-lg overflow-hidden border border-[#AA771C]/25 bg-white/80 backdrop-blur-md shadow-[0_12px_30px_rgba(140,98,18,0.06),0_4px_10px_rgba(0,0,0,0.03)] flex flex-col justify-center items-center"
            >
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="font-serif text-2xl md:text-4xl font-light text-[#2E251B] tracking-wider relative h-8 md:h-12 w-full flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute"
                  >
                    {String(item.value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>

              <span className="text-[8px] md:text-[10px] font-sans tracking-[0.2em] text-[#AA771C] uppercase mt-2">
                {item.label}
              </span>

              <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#AA771C]/35 rounded-tl-sm" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#AA771C]/35 rounded-tr-sm" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#AA771C]/35 rounded-bl-sm" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#AA771C]/35 rounded-br-sm" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
