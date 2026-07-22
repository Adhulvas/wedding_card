'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingElement {
  id: number;
  type: 'heart' | 'petal-pink' | 'petal-cream';
  size: number;
  startX: number; // percentage
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
  rotation: number;
  sway: number; // horizontal drift px
  layer: 'back' | 'mid' | 'front';
}

export default function FloatingHearts() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const generated: FloatingElement[] = [];

    // 1. Generate Floating Hearts (Rising)
    // 15 hearts total, varying layers
    for (let i = 0; i < 15; i++) {
      const layer = i % 3 === 0 ? 'front' : i % 3 === 1 ? 'mid' : 'back';
      generated.push({
        id: i,
        type: 'heart',
        size: layer === 'front' ? 22 + (i % 3) * 4 : layer === 'mid' ? 14 + (i % 3) * 3 : 8 + (i % 3) * 2,
        startX: (i * 7.7) % 94 + 3,
        duration: layer === 'front' ? 18 + (i % 3) * 3 : layer === 'mid' ? 26 + (i % 3) * 4 : 35 + (i % 3) * 5,
        delay: -(i * 2.5),
        scale: layer === 'front' ? 1.0 + (i % 2) * 0.15 : layer === 'mid' ? 0.9 + (i % 2) * 0.1 : 0.8,
        opacity: layer === 'front' ? 0.50 + (i % 2) * 0.10 : layer === 'mid' ? 0.35 + (i % 2) * 0.05 : 0.22,
        rotation: (i * 27) % 60 - 30,
        sway: 15 + (i % 3) * 10,
        layer,
      });
    }

    // 2. Generate Pink Rose Petals (Falling)
    // 12 pink petals total
    for (let i = 0; i < 12; i++) {
      const layer = i % 3 === 0 ? 'front' : i % 3 === 1 ? 'mid' : 'back';
      generated.push({
        id: i + 15,
        type: 'petal-pink',
        size: layer === 'front' ? 24 + (i % 3) * 4 : layer === 'mid' ? 16 + (i % 3) * 3 : 10 + (i % 3) * 2,
        startX: (i * 9.1 + 5) % 90 + 5,
        duration: layer === 'front' ? 15 + (i % 3) * 2 : layer === 'mid' ? 22 + (i % 3) * 3 : 32 + (i % 3) * 4,
        delay: -(i * 3.1),
        scale: layer === 'front' ? 1.1 + (i % 2) * 0.1 : layer === 'mid' ? 0.9 + (i % 2) * 0.15 : 0.75,
        opacity: layer === 'front' ? 0.70 + (i % 2) * 0.10 : layer === 'mid' ? 0.50 + (i % 2) * 0.05 : 0.35,
        rotation: (i * 37) % 180,
        sway: 25 + (i % 3) * 15,
        layer,
      });
    }

    // 3. Generate Cream/Champagne Petals (Falling)
    // 12 cream petals total
    for (let i = 0; i < 12; i++) {
      const layer = i % 3 === 0 ? 'front' : i % 3 === 1 ? 'mid' : 'back';
      generated.push({
        id: i + 27,
        type: 'petal-cream',
        size: layer === 'front' ? 24 + (i % 3) * 4 : layer === 'mid' ? 16 + (i % 3) * 3 : 10 + (i % 3) * 2,
        startX: (i * 11.3 + 12) % 90 + 5,
        duration: layer === 'front' ? 17 + (i % 3) * 2 : layer === 'mid' ? 24 + (i % 3) * 3 : 34 + (i % 3) * 4,
        delay: -(i * 2.8),
        scale: layer === 'front' ? 1.1 + (i % 2) * 0.1 : layer === 'mid' ? 0.9 + (i % 2) * 0.15 : 0.75,
        opacity: layer === 'front' ? 0.75 + (i % 2) * 0.10 : layer === 'mid' ? 0.55 + (i % 2) * 0.05 : 0.40,
        rotation: (i * 47) % 180,
        sway: 20 + (i % 3) * 15,
        layer,
      });
    }

    setElements(generated);
  }, []);

  if (elements.length === 0) return null;

  // Custom paths for organic wedding shapes
  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  // Asymmetric leaf-like flower petal paths
  const petalPath1 = "M12 21.5c-4.5 0-8-3.5-8-7.5 0-3.5 2.5-6.5 5.5-7.5.5-.2 1-.3 1.5-.3 3.5 0 6.5 3 6.5 6.5 0 4-3 7.5-5.5 8.8z";
  const petalPath2 = "M12 22c-3.5 0-7-2.5-7-6.5 0-3.5 2.5-5.5 4.5-6 1.5-.4 3 .2 4 .8 1.5-.8 3-1.2 4.5-.8 2.5.6 4.5 2.5 4.5 6 0 4-3.5 6.5-7.5 6.5z";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30 select-none">
      {elements.map((el) => {
        const isHeart = el.type === 'heart';

        // Dynamic styling for glows and colors
        let colorClass = '';
        let strokeColor = '';
        let fillColor = '';
        let glowShadow = '';

        if (el.type === 'heart') {
          // Warm gold
          colorClass = 'text-[#AA771C]/90';
          strokeColor = 'currentColor';
          fillColor = 'rgba(212, 175, 55, 0.15)';
          if (el.layer === 'front') {
            glowShadow = 'drop-shadow(0 0 8px rgba(170, 119, 28, 0.35))';
          } else if (el.layer === 'mid') {
            glowShadow = 'drop-shadow(0 0 4px rgba(170, 119, 28, 0.2))';
          }
        } else if (el.type === 'petal-pink') {
          // Blush pink rose petal
          colorClass = 'text-[#FFB6C1]';
          strokeColor = 'rgba(255, 182, 193, 0.7)';
          fillColor = 'rgba(255, 182, 193, 0.75)';
          if (el.layer === 'front') {
            glowShadow = 'drop-shadow(0 0 6px rgba(255, 182, 193, 0.3))';
          }
        } else {
          // Warm champagne cream petal
          colorClass = 'text-[#D4AF37]';
          strokeColor = 'rgba(212, 175, 55, 0.6)';
          fillColor = 'rgba(255, 245, 230, 0.85)';
          if (el.layer === 'front') {
            glowShadow = 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.25))';
          }
        }

        // Animation configurations
        // Hearts float UP, Petals fall DOWN
        const yStart = isHeart ? '105vh' : '-10vh';
        const yEnd = isHeart ? '-10vh' : '105vh';

        // Organic rotatory variations (petals tumble, hearts sway)
        const rotAnim = isHeart
          ? [el.rotation, el.rotation + 15, el.rotation - 15, el.rotation]
          : [el.rotation, el.rotation + 180, el.rotation + 360];

        // Horizontal swaying values
        const xAnim = [0, el.sway, -el.sway, el.sway, 0];

        return (
          <motion.div
            key={el.id}
            className={`absolute ${colorClass} pointer-events-none`}
            style={{
              left: `${el.startX}%`,
              width: el.size,
              height: el.size,
              filter: glowShadow || undefined,
            }}
            initial={{
              y: yStart,
              x: 0,
              opacity: 0,
              rotate: el.rotation,
              scale: el.scale * 0.8
            }}
            animate={{
              y: [yStart, yEnd],
              x: xAnim,
              opacity: [0, el.opacity, el.opacity, 0],
              rotate: rotAnim,
              scale: [el.scale * 0.8, el.scale, el.scale, el.scale * 0.8]
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: 'easeInOut',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.2"
              className="w-full h-full"
            >
              <path
                d={isHeart ? heartPath : (el.id % 2 === 0 ? petalPath1 : petalPath2)}
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
