'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Dynamically instantiate the Audio element on client mount
    const audio = new Audio('/audio/wedding_bg.mp3');
    audio.loop = true;
    audio.volume = 0.45; // 45% volume (pleasant default range)
    audioRef.current = audio;

    const startPlayback = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          removeInteractionListeners();
        })
        .catch((err) => {
          console.log('Autoplay blocked by browser. Awaiting user interaction.', err);
        });
    };

    // Play on first user interaction anywhere on the page
    const handleInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch((err) => {
            console.log('Playback attempt on interaction failed:', err);
          });
      }
    };

    const addInteractionListeners = () => {
      window.addEventListener('click', handleInteraction, { once: true });
      window.addEventListener('touchstart', handleInteraction, { once: true });
      window.addEventListener('keydown', handleInteraction, { once: true });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    // Initiate play attempts
    startPlayback();
    addInteractionListeners();

    return () => {
      removeInteractionListeners();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Manual play toggle failed:', err);
        });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none pointer-events-auto">
      <motion.button
        onClick={togglePlay}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-12 h-12 rounded-full glass-panel cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-amber-400/20 text-amber-200 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300"
        title={isPlaying ? "Mute Soundtrack" : "Play Soundtrack"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: -15 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 15 }}
              transition={{ duration: 0.2 }}
              className="flex items-end justify-center space-x-[2px] h-[20px] w-[24px]"
            >
              {/* Premium equalized sound waves */}
              {[...Array(4)].map((_, i) => (
                <motion.span
                  key={i}
                  className="w-[2.5px] bg-amber-300 rounded-full"
                  style={{ transformOrigin: 'bottom' }}
                  animate={{
                    height: ['6px', '18px', '6px'],
                  }}
                  transition={{
                    duration: 0.6 + i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <VolumeX className="w-5 h-5 text-amber-300/60" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
