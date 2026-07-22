'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar } from 'lucide-react';

const CornerTopLeft = () => (
  <div className="absolute top-4 left-4 w-12 h-12 border-t-[2px] border-l-[2px] border-[#AA771C]/70 pointer-events-none">
    <div className="absolute top-1.5 left-1.5 w-10 h-10 border-t-[1px] border-l-[1px] border-[#AA771C]/50" />
    <div className="absolute top-3 left-3 w-8 h-8 border-t-[1px] border-l-[1px] border-[#AA771C]/30" />
  </div>
);

const CornerTopRight = () => (
  <div className="absolute top-4 right-4 w-12 h-12 border-t-[2px] border-r-[2px] border-[#AA771C]/70 pointer-events-none">
    <div className="absolute top-1.5 right-1.5 w-10 h-10 border-t-[1px] border-r-[1px] border-[#AA771C]/50" />
    <div className="absolute top-3 right-3 w-8 h-8 border-t-[1px] border-r-[1px] border-[#AA771C]/30" />
  </div>
);

const CornerBottomLeft = () => (
  <div className="absolute bottom-4 left-4 w-12 h-12 border-b-[2px] border-l-[2px] border-[#AA771C]/70 pointer-events-none">
    <div className="absolute bottom-1.5 left-1.5 w-10 h-10 border-b-[1px] border-l-[1px] border-[#AA771C]/50" />
    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-[1px] border-l-[1px] border-[#AA771C]/30" />
  </div>
);

const CornerBottomRight = () => (
  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-[2px] border-r-[2px] border-[#AA771C]/70 pointer-events-none">
    <div className="absolute bottom-1.5 right-1.5 w-10 h-10 border-b-[1px] border-r-[1px] border-[#AA771C]/50" />
    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-[1px] border-r-[1px] border-[#AA771C]/30" />
  </div>
);

export default function RoyalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(1000); // Default estimate

  // Measure actual height of the parchment content
  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    // Add a slight delay to ensure fonts/images are loaded before measuring
    setTimeout(measure, 500);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Tie unrolling animation to viewport scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 15%"]
    // Unroll starts when top of container hits 85% of screen height
    // Finishes when top of container hits 15% of screen height
  });

  // Calculate the clip-path inset from bottom (100% hidden -> 0% fully visible)
  const clipBottom = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useTransform(clipBottom, (val) => `inset(0% 0% ${val}% 0%)`);

  // Calculate the vertical movement of the bottom roller
  // It starts right below the top roller (-contentHeight) and moves down to 0
  const rollerY = useTransform(scrollYProgress, [0, 1], [-contentHeight, 0]);

  // Fade content in gracefully as it reveals
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.8, 1]);

  // Google Calendar links
  const ceremonyCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Ceremony%3A+Alil+Vas+%26+Sneha&dates=20260823T050000Z%2F20260823T054500Z&details=Together+with+our+families%2C+we+invite+you+to+celebrate+the+holy+wedding+of+Alil+Vas+and+Sneha.+Ceremony+Time%3A+10%3A30+AM+-+11%3A15+AM.&location=Panayal+Sree+Mahalingeshwara+Temple%2C+Kasaragod%2C+Kerala%2C+India&sf=true&output=xml`;
  const receptionCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception%3A+Alil+Vas+%26+Sneha&dates=20260827T120000Z%2F20260827T160000Z&details=Join+us+to+celebrate+the+wedding+reception+of+Alil+Vas+and+Sneha.+Time%3A+05%3A30+PM+-+09%3A30+PM.&location=St+Mary%27s+Convention+Centre%2C+Nellayi%2C+Thrissur%2C+Kerala%2C+India&sf=true&output=xml`;

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-4 py-24 flex flex-col items-center z-20">

      {/* --- TOP ROLLER --- */}
      <div className="w-[100%] max-w-3xl h-10 md:h-12 bg-gradient-to-b from-[#3A2603] via-[#FCE487] to-[#3A2603] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-[#2A1B02] z-30 relative flex items-center justify-between">
        {/* Left Knob */}
        <div className="absolute -left-3 md:-left-4 w-6 md:w-8 h-12 md:h-16 bg-gradient-to-r from-[#2A1B02] via-[#E2C775] to-[#2A1B02] rounded-full shadow-lg border border-[#1A0B00] top-1/2 -translate-y-1/2" />
        {/* Right Knob */}
        <div className="absolute -right-3 md:-right-4 w-6 md:w-8 h-12 md:h-16 bg-gradient-to-l from-[#2A1B02] via-[#E2C775] to-[#2A1B02] rounded-full shadow-lg border border-[#1A0B00] top-1/2 -translate-y-1/2" />

        {/* Intricate center detail on roller */}
        <div className="w-full mx-8 h-[2px] bg-[#1A0B00]/40 border-b border-[#FFF2CD]/40" />
      </div>

      {/* --- PARCHMENT PAPER --- */}
      <motion.div
        style={{ clipPath }}
        className="w-[92%] max-w-[92%] relative z-20 -my-1"
      >
        <div
          ref={contentRef}
          className="w-full bg-[#FDFBF7] relative overflow-hidden shadow-[inset_0_0_50px_rgba(140,98,18,0.12)] border-x-[3px] border-[#AA771C]/30"
        >
          {/* Subtle vintage texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#8C6212]/5 via-transparent to-[#8C6212]/5 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#D4AF37]/20 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#D4AF37]/20 to-transparent pointer-events-none" />

          {/* Inner Golden Border */}
          <div className="absolute inset-2 md:inset-4 border border-[#AA771C]/20 pointer-events-none" />
          <div className="absolute inset-3 md:inset-5 border-[0.5px] border-[#AA771C]/15 pointer-events-none" />

          {/* Golden Corner Ornaments */}
          <CornerTopLeft />
          <CornerTopRight />
          <CornerBottomLeft />
          <CornerBottomRight />

          {/* --- CONTENT --- */}
          <motion.div style={{ opacity: contentOpacity }} className="p-10 md:p-16 lg:p-20 space-y-20 relative z-10">

            {/* The Couple */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <span className="font-sans tracking-[0.4em] text-xs uppercase text-[#AA771C]/80">The Union Of</span>
                <h2 className="heading-romantic text-4xl sm:text-5xl md:text-6xl text-[#2E251B] drop-shadow-sm">Two Souls</h2>
                <div className="flex items-center justify-center gap-4 w-64 mx-auto pt-2">
                  <div className="h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/80 flex-1" />
                  <div className="w-2 h-2 rotate-45 border border-[#AA771C] bg-[#FAF8F5]" />
                  <div className="h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/80 flex-1" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 md:gap-8 text-center relative">
                {/* Vertical Divider for desktop */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />

                {/* Groom */}
                <div className="space-y-5 px-4">
                  <h3 className="heading-romantic text-4xl md:text-4xl text-[#2E251B]">Alilvas</h3>
                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#AA771C]/90 mb-1">Son of</p>
                      <p className="font-serif text-xl text-[#2E251B]">Suresh &amp; Shina</p>
                    </div>
                    <div className="pt-2">
                      <p className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#AA771C]/90 mb-1">Address</p>
                      <p className="font-serif text-sm text-[#4E3E2F]/90 leading-relaxed max-w-[200px] mx-auto">
                        Perumkulam House,<br />Panthalloor,<br />Nellayi, Thrissur, Kerala
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bride */}
                <div className="space-y-5 px-4">
                  <h3 className="heading-romantic text-4xl md:text-4xl text-[#2E251B]">Sneha</h3>
                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#AA771C]/90 mb-1">Daughter of</p>
                      <p className="font-serif text-xl text-[#2E251B]">Praveen &amp; Ummadevi</p>
                    </div>
                    <div className="pt-2">
                      <p className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-[#AA771C]/90 mb-1">Address</p>
                      <p className="font-serif text-sm text-[#4E3E2F]/90 leading-relaxed max-w-[200px] mx-auto">
                        Karuvakode House,<br />Periya,<br />Kasaragod, Kerala
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-16 h-16 opacity-30">
                {/* Elegant flourish center icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="#AA771C" strokeWidth="1" className="w-full h-full">
                  <path d="M12 2C12 2 15 8 15 12C15 16 12 22 12 22" />
                  <path d="M12 2C12 2 9 8 9 12C9 16 12 22 12 22" />
                  <path d="M5 12H19" />
                  <circle cx="12" cy="12" r="2" fill="#FAF8F5" />
                </svg>
              </div>
            </div>

            {/* The Celebrations */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <h2 className="heading-romantic text-4xl sm:text-5xl text-[#2E251B]">The Celebrations</h2>
                <div className="flex items-center justify-center gap-4 w-64 mx-auto pt-2">
                  <div className="h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/80 flex-1" />
                  <div className="w-2 h-2 rotate-45 border border-[#AA771C] bg-[#FAF8F5]" />
                  <div className="h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/80 flex-1" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 md:gap-8 text-center relative">
                {/* Vertical Divider for desktop */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />

                {/* Ceremony */}
                <div className="space-y-6 flex flex-col items-center">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#2E251B] tracking-wide">
                    Wedding Ceremony
                  </h3>
                  <div className="space-y-4 font-sans text-[#4E3E2F] tracking-wide flex flex-col items-center">
                    <div className="flex flex-col items-center">
                      <span className="font-serif text-[#AA771C] uppercase text-[10px] sm:text-xs tracking-wider font-semibold mb-1">Date & Time</span>
                      <span className="font-serif text-[#2E251B] text-base">23 Aug 2026, Sunday</span>
                      <span className="text-[#2E251B] text-sm mt-0.5">10:30 AM - 11:15 AM</span>
                    </div>
                    <div className="flex flex-col items-center pt-2">
                      <span className="font-serif text-[#AA771C] uppercase text-[10px] sm:text-xs tracking-wider font-semibold mb-1">Venue</span>
                      <p className="font-serif text-sm leading-relaxed text-[#4E3E2F]/90 max-w-[220px]">
                        Panayal Sree Mahalingeshwara Temple,<br />Kasaragod
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a
                      href={ceremonyCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full border border-[#AA771C] bg-[#FAF8F5] text-xs uppercase font-serif tracking-widest text-[#8C6212] transition-all hover:bg-[#AA771C] hover:text-white shadow-sm hover:shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Add To Calendar</span>
                    </a>
                  </div>
                </div>

                {/* Reception */}
                <div className="space-y-6 flex flex-col items-center">
                  <h3 className="font-serif text-2xl md:text-3xl text-[#2E251B] tracking-wide">
                    Wedding Reception
                  </h3>
                  <div className="space-y-4 font-sans text-[#4E3E2F] tracking-wide flex flex-col items-center">
                    <div className="flex flex-col items-center">
                      <span className="font-serif text-[#AA771C] uppercase text-[10px] sm:text-xs tracking-wider font-semibold mb-1">Date & Time</span>
                      <span className="font-serif text-[#2E251B] text-base">27 Aug 2026, Thursday</span>
                      <span className="text-[#2E251B] text-sm mt-0.5">5:30 PM - 9:30 PM</span>
                    </div>
                    <div className="flex flex-col items-center pt-2">
                      <span className="font-serif text-[#AA771C] uppercase text-[10px] sm:text-xs tracking-wider font-semibold mb-1">Venue</span>
                      <p className="font-serif text-sm leading-relaxed text-[#4E3E2F]/90 max-w-[220px]">
                        St Mary's Convention Centre,<br />Nellayi, Thrissur, Kerala
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a
                      href={receptionCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full border border-[#AA771C] bg-[#FAF8F5] text-xs uppercase font-serif tracking-widest text-[#8C6212] transition-all hover:bg-[#AA771C] hover:text-white shadow-sm hover:shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Add To Calendar</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>

      {/* --- BOTTOM ROLLER --- */}
      <motion.div
        style={{ y: rollerY }}
        className="w-[100%] max-w-3xl h-10 md:h-12 bg-gradient-to-b from-[#3A2603] via-[#FCE487] to-[#3A2603] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-[#2A1B02] z-30 relative flex items-center justify-between -mt-1"
      >
        {/* Left Knob */}
        <div className="absolute -left-3 md:-left-4 w-6 md:w-8 h-12 md:h-16 bg-gradient-to-r from-[#2A1B02] via-[#E2C775] to-[#2A1B02] rounded-full shadow-lg border border-[#1A0B00] top-1/2 -translate-y-1/2" />
        {/* Right Knob */}
        <div className="absolute -right-3 md:-right-4 w-6 md:w-8 h-12 md:h-16 bg-gradient-to-l from-[#2A1B02] via-[#E2C775] to-[#2A1B02] rounded-full shadow-lg border border-[#1A0B00] top-1/2 -translate-y-1/2" />

        {/* Intricate center detail on roller */}
        <div className="w-full mx-8 h-[2px] bg-[#1A0B00]/40 border-b border-[#FFF2CD]/40" />
      </motion.div>

    </div>
  );
}
