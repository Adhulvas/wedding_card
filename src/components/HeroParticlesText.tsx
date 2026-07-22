'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroParticlesText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let particles: any[] = [];
    let amount = 0;
    let mouse = { x: -9999, y: -9999 };
    let animId: number;
    let interactionRadius = 60;

    // Rose petal colors (deep reds, soft pinks)
    const colors = ["#9b1b30", "#c21e3a", "#e83a59", "#ff6b81", "#d6304a", "#800f22"];
    // const colors = [
    //   "#FFFFFF",
    //   "#FFFCF7",
    //   "#FFF3E6",
    //   "#FFE8CC",
    //   "#FFD6A5",
    //   "#FFC078",
    // ];

    let ww = canvas.width = window.innerWidth;
    const container = canvas.parentElement;
    if (!container) return;
    ww = canvas.width = container.clientWidth;
    let wh = canvas.height = container.clientHeight;

    class Particle {
      x: number;
      y: number;
      dest: { x: number; y: number };
      r: number;
      vx: number;
      vy: number;
      accX: number;
      accY: number;
      friction: number;
      color: string;
      angle: number;
      spin: number;

      constructor(x: number, y: number) {
        this.x = Math.random() * ww;
        this.y = Math.random() * wh;
        this.dest = { x, y };
        // Petal size
        this.r = Math.random() * 2.5 + 1.5;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
        this.accX = 0;
        this.accY = 0;
        this.friction = Math.random() * 0.04 + 0.92;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.2;
      }

      render() {
        // Weaker return force to bring them back slower
        this.accX = (this.dest.x - this.x) / 500;
        this.accY = (this.dest.y - this.y) / 500;
        this.vx += this.accX;
        this.vy += this.accY;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        // Spin the petal based on its velocity
        let speed = Math.abs(this.vx) + Math.abs(this.vy);
        this.angle += this.spin * (speed / 2);

        ctx!.fillStyle = this.color;

        // Draw petal shape
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.angle);
        ctx!.beginPath();
        ctx!.moveTo(0, 0);
        ctx!.quadraticCurveTo(this.r, -this.r, 0, -this.r * 2);
        ctx!.quadraticCurveTo(-this.r, -this.r, 0, 0);
        ctx!.fill();
        ctx!.rotate(-this.angle);
        ctx!.translate(-this.x, -this.y);

        let a = this.x - mouse.x;
        let b = this.y - mouse.y;

        let distance = Math.sqrt(a * a + b * b);
        // Interaction area - limited spread area
        if (distance < interactionRadius) {
          // Push away force based on distance, so particles don't fly forever
          this.accX = (this.x - mouse.x) / 35;
          this.accY = (this.y - mouse.y) / 35;
          this.vx += this.accX;
          this.vy += this.accY;
        }
      }
    }

    function initScene() {
      if (!canvas || !container || !ctx) return;
      ww = canvas.width = container.clientWidth;
      wh = canvas.height = container.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = ww < 768;
      interactionRadius = isMobile ? 40 : 60;
      // Increase font size for mobile — larger divisor = smaller text
      const fontSize = isMobile ? Math.min(ww / 6.5, 75) : Math.min(ww / 10, 110);

      // Match the Dancing Script romantic heading font
      ctx.font = `700 ${fontSize}px "montserrat", cursive`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw text
      const lines = ["ALILVAS", "&", "SNEHA"];
      const lineHeight = fontSize * 1.2;
      const startY = wh / 2 - lineHeight;

      lines.forEach((line, i) => {
        let y = startY + (i * lineHeight);
        if (line === "&") {
          ctx.font = `400 ${fontSize * 0.55}px "montserrat", cursive`;
        } else {
          ctx.font = `700 ${fontSize}px "montserrat", cursive`;
        }
        ctx.fillText(line, ww / 2, y);
      });

      // Get pixel data
      const data = ctx.getImageData(0, 0, ww, wh).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = [];
      // Smaller step for more petals covering the text area completely
      const step = isMobile ? 2 : 3;
      for (let i = 0; i < ww; i += step) {
        for (let j = 0; j < wh; j += step) {
          // Lower alpha threshold to pick up more of the font edges
          if (data[((i + j * ww) * 4) + 3] > 50) {
            particles.push(new Particle(i, j));
          }
        }
      }
      amount = particles.length;
    }

    function render() {
      if (!canvas) return;
      animId = requestAnimationFrame(render);
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < amount; i++) {
        particles[i].render();
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const onTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const onMouseClick = (e: MouseEvent) => {
      // Just set a quick splash on click
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener("resize", initScene);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove);
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("click", onMouseClick);
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("mouseleave", onTouchEnd);

    // Initial delay to let fonts load
    const timeout = setTimeout(() => {
      // document.fonts.ready might be better, but simple timeout works
      initScene();
      render();
    }, 800);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", initScene);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("click", onMouseClick);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("mouseleave", onTouchEnd);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[50vh] flex items-center justify-center relative z-20 cursor-crosshair">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
      />
    </div>
  );
}
