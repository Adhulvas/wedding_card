'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from '@/components/Envelope';
import ScratchToReveal from '@/components/ScratchToReveal';
import Countdown from '@/components/Countdown';
import RoyalScroll from '@/components/RoyalScroll';
import FloatingHearts from '@/components/FloatingHearts';
import BackgroundMusic from '@/components/BackgroundMusic';
import HeroParticlesText from '@/components/HeroParticlesText';

export default function Home() {
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Delay heavy extras so they don't compete with the reveal transition
  const [showExtras, setShowExtras] = useState(false);
  // Delay particle text mount so formation plays while fully visible
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent browser from restoring previous scroll position
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isInvitationOpened) {
      // Particles: short delay so CSS fade-in completes first
      const t1 = setTimeout(() => setShowParticles(true), 200);
      // Extras: longer delay so they don't compete with the reveal
      const t2 = setTimeout(() => setShowExtras(true), 700);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isInvitationOpened]);

  // Prevent scroll when envelope is overlaying
  useEffect(() => {
    if (!isInvitationOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isInvitationOpened]);

  return (
    <main className="relative min-h-screen bg-[#FAF6F0] text-[#2E251B] overflow-x-hidden selection:bg-amber-400 selection:text-black">

      {/* 1. ENVELOPE LANDING OVERLAY */}
      <Envelope onOpenComplete={() => setIsInvitationOpened(true)} />

      {/* Extras mount 700ms after open so they don't stutter the reveal */}
      {showExtras && (
        <>
          <FloatingHearts />
          <BackgroundMusic />
        </>
      )}

      {/* All content is pre-rendered behind doors. CSS opacity does the reveal — no React work. */}
      <div
        className="relative w-full"
        style={{
          opacity: isInvitationOpened ? 1 : 0,
          transition: isInvitationOpened ? 'opacity 0.6s ease 0.1s' : 'none',
          pointerEvents: isInvitationOpened ? 'auto' : 'none',
        }}
      >
        {/* A. HERO SECTION */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 z-20 overflow-hidden">

          {/* Background Cover Image - Mobile */}
          <div
            className="absolute inset-0 z-0 pointer-events-none md:hidden"
            style={{
              backgroundImage: 'url(/assets/mobile-cover3.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          {/* Background Cover Image - Desktop */}
          <div
            className="absolute inset-0 z-0 pointer-events-none hidden md:block"
            style={{
              backgroundImage: 'url(/assets/hero-cover3.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          {/* Subtle overlay so text remains readable without hiding the image completely */}
          <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none" />
          {/* <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FAF6F0] to-transparent pointer-events-none z-0" /> */}

          {/* Background ambient lighting */}
          <div className="absolute top-1/4 w-[300px] h-[300px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none z-0" />

          <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-4xl relative z-10"
          >

            {/* <h2 className="font-serif italic text-lg md:text-xl max-w-4xl mx-auto px-4 leading-relaxed text-[#e0ca65]/90 mt-4">
              We're Getting Married
            </h2> */}

            <div className="py-2 md:py-6 w-full">
              {/* Mount 200ms after reveal so particle formation is fully visible */}
              {showParticles
                ? <HeroParticlesText />
                : <div className="w-full min-h-[50vh]" />
              }
            </div>

            <p className="font-serif italic text-sm md:text-xl text-[#FAF6F0]/90 max-w-4xl mx-auto px-4 leading-relaxed mt-6 drop-shadow-md">
              "We are deeply honored to welcome you to the wedding ceremony of Alil & Sneha. As they begin their journey together in faith and love, we thank you for being part of this blessed occasion."
            </p>

            {/* Downwards Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="pt-16 flex flex-col items-center space-y-2 cursor-default pointer-events-none"
            >
              <span className="text-xs sm:text-sm font-dancingScript tracking-[0.4em] uppercase text-white/70">
                Scroll to Unveil
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-white/70 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* SCRATCH TO REVEAL SECTION */}
        <section className="relative z-20 w-full bg-transparent">
          <ScratchToReveal />
        </section>

        {/* COUNTDOWN SECTION */}
        <section className="relative z-20 w-full bg-transparent pt-10 pb-4">
          <Countdown />
        </section>

        {/* B. STORYTELLING REGION */}
        <div className="relative w-full">

          {/* 2. THE COUPLE INTRO SECTION (Features first image: sketch) */}
          <section className="relative py-20 px-4 z-20 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center space-y-12">

              <motion.div
                initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                className="space-y-4"
              >
              </motion.div>

              {/* luxury portrait dissolve */}
              {/* Seamless Cinematic Portrait */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                className="relative mx-auto h-[50vh] w-full max-w-xl flex items-center justify-center overflow-visible"
              >
                {/* Volumetric glow background - extremely soft and subtle */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded-full blur-[110px] pointer-events-none -z-10" />

                {/* Volumetric light ray shape - extremely subtle */}
                <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[300px] h-[130%] bg-gradient-to-b from-[#AA771C]/2 via-transparent to-transparent pointer-events-none -z-10" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} />

                {/* Grounding shadow overlay at the bottom of the couple */}
                <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/80 to-transparent pointer-events-none z-10" />

                {/* Interactive gold floating hearts — client-only to avoid hydration mismatch */}
                {mounted && [...Array(10)].map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 10;
                  const xOffset = Math.sin(angle) * 35;
                  const yOffset = Math.cos(angle) * 45;
                  return (
                    <motion.div
                      key={i}
                      className="absolute text-[#AA771C]/65 pointer-events-none"
                      suppressHydrationWarning
                      style={{
                        top: `${40 + yOffset}%`,
                        left: `${50 + xOffset}%`,
                        width: `${10 + (i % 3) * 2}px`,
                        height: `${10 + (i % 3) * 2}px`,
                      }}
                      animate={{
                        y: [0, -40 - (i % 3) * 10, 0],
                        x: [0, (i % 2 === 0 ? 15 : -15), 0],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.2, 0.5],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{
                        duration: 5 + (i % 3) * 1.5,
                        repeat: Infinity,
                        delay: (i % 4) * 0.9,
                        ease: 'easeInOut'
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-full h-full"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </motion.div>
                  );
                })}

                <div
                  className="relative w-full h-full"
                  style={{
                    maskImage: `
                            linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%),
                            linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)
                          `,
                    WebkitMaskImage: `
                            linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%),
                            linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)
                          `,
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in',
                  }}
                >
                  <img
                    src="/assets/alil_sneha.png"
                    alt="Alil and Sneha portrait"
                    className="w-full h-full object-cover object-top brightness-[0.97] contrast-[1.01]"
                  />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 1 }}
                className="font-serif italic text-[#4E3E2F]/80 text-base sm:text-2xl md:text-lg max-w-xl mx-auto leading-relaxed"
              >
                "We invite you to share our joy as we embark on this cinematic journey of love and commitment."
              </motion.p>
            </div>
          </section>

          {/* 3. ROYAL SCROLL SECTION (Groom, Bride & Events) */}
          <section className="relative z-20">
            <RoyalScroll />
          </section>

        </div>

        {/* ── CEREMONY VENUE SECTION ── */}
        <section className="relative w-full overflow-hidden border-t border-amber-500/10">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="text-center pt-16 pb-6 px-4 space-y-3"
          >
            <h2 className="heading-romantic text-4xl sm:text-5xl">Ceremony</h2>
            <div className="flex items-center justify-center gap-3 w-48 mx-auto">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/50 flex-1" />
              <div className="w-1 h-1 rotate-45 bg-[#AA771C]/60" />
              <div className="h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/50 flex-1" />
            </div>
            <p className="font-serif italic text-xl lg:text-xl text-[#4E3E2F] tracking-wide">
              Panayal Sree Mahalingeshwara Temple
            </p>
            <p className="font-serif italic text-sm sm:text-base text-[#4E3E2F]/70 leading-relaxed">
              Panayal, Kasaragod, Kerala
            </p>
          </motion.div>

          {/* Map / Directions buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="px-4 pb-16 pt-6 max-w-sm mx-auto flex flex-col sm:flex-row gap-3"
          >
            <a
              href="https://maps.google.com/?q=Panayal+Sree+Mahalingeshwara+Temple,+Kasaragod"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-sm uppercase font-serif tracking-widest text-white font-semibold shadow-md hover:from-[#AA771C] hover:to-[#8C6212] transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="whitespace-nowrap">Open in Maps</span>
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Panayal+Sree+Mahalingeshwara+Temple,+Kasaragod"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-[#AA771C]/35 bg-[#FAF8F5] text-sm uppercase font-serif tracking-widest text-[#8C6212] hover:bg-[#AA771C]/10 hover:border-[#AA771C] transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <span className="whitespace-nowrap">Directions</span>
            </a>
          </motion.div>
        </section>

        {/* ── RECEPTION VENUE SECTION ── */}
        <section className="relative w-full overflow-hidden border-t border-amber-500/10">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="text-center pt-16 pb-6 px-4 space-y-3"
          >
            <h2 className="heading-romantic text-4xl sm:text-5xl">Reception</h2>
            <div className="flex items-center justify-center gap-3 w-48 mx-auto">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/50 flex-1" />
              <div className="w-1 h-1 rotate-45 bg-[#AA771C]/60" />
              <div className="h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/50 flex-1" />
            </div>
            <p className="font-serif italic text-xl lg:text-xl text-[#4E3E2F] tracking-wide">
              St Mary's Convention Centre
            </p>
            <p className="font-serif italic text-sm sm:text-base text-[#4E3E2F]/70 leading-relaxed">
              Nellayi Junction, Thrissur, Kerala
            </p>
          </motion.div>

          {/* Map / Directions buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="px-4 pb-16 pt-6 max-w-sm mx-auto flex flex-col sm:flex-row gap-3"
          >
            <a
              href="https://maps.google.com/?q=St+Mary's+Convention+Centre,+Nellayi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-sm uppercase font-serif tracking-widest text-white font-semibold shadow-md hover:from-[#AA771C] hover:to-[#8C6212] transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="whitespace-nowrap">Open in Maps</span>
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=St+Mary's+Convention+Centre,+Nellayi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-[#AA771C]/35 bg-[#FAF8F5] text-sm uppercase font-serif tracking-widest text-[#8C6212] hover:bg-[#AA771C]/10 hover:border-[#AA771C] transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <span className="whitespace-nowrap">Directions</span>
            </a>
          </motion.div>
        </section>

        {/* GIFTS SECTION */}
        <section className="relative py-20 px-4 z-20 text-center overflow-hidden bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="heading-romantic text-4xl sm:text-5xl">Gifts</h2>

            <div className="flex items-center justify-center gap-3 w-64 md:w-80 mx-auto mt-4 mb-8">
              <div className="h-[1.5px] bg-gradient-to-r from-transparent to-[#D4AF37]/60 flex-1" />
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-[#aa251c]"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
              <div className="h-[1.5px] bg-gradient-to-l from-transparent to-[#D4AF37]/60 flex-1" />
            </div>

            <p className="font-serif italic text-xl lg:text-xl text-[#4E3E2F]/90 leading-relaxed px-4">
              Your love, blessings, and presence are the greatest gifts we could ever ask for.
            </p>
          </motion.div>
        </section>


        {/* FOOTER SECTION */}
        <footer className="relative py-12 px-4 z-20 text-center overflow-hidden bg-transparent">
          {/* Background amber flare */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center space-y-6 pt-16">
            <p className="font-serif italic text-xl lg:text-xl text-[#4E3E2F] leading-relaxed">
              "Thank you for being a part of our special day."
            </p>

            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

            <div className="text-center space-y-2 pointer-events-none opacity-80 pb-8">
              <p className="font-sans text-sm uppercase tracking-[0.25em] text-[#8C6212]">
                Alilvas &amp; Sneha
              </p>
              <p className="font-serif text-sm italic text-[#4E3E2F]">
                August 23, 2026
              </p>
            </div>
          </div>
        </footer>

      </div>

    </main>
  );
}
