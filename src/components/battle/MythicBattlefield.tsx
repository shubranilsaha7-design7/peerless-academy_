import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MythicBattlefieldProps {
  playerHp: number;
  oppHp: number;
  maxHp: number;
  attackAnimation: 'none' | 'player' | 'enemy';
  arjunaImageSrc?: string;
  karnaImageSrc?: string;
}

export default function MythicBattlefield({ playerHp, oppHp, maxHp, attackAnimation, arjunaImageSrc, karnaImageSrc }: MythicBattlefieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Engine for Astras
  useEffect(() => {
    if (attackAnimation === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles: any[] = [];
    let beamX = attackAnimation === 'player' ? 100 : canvas.width - 100;
    const targetX = attackAnimation === 'player' ? canvas.width - 100 : 100;
    const direction = attackAnimation === 'player' ? 1 : -1;
    const color = attackAnimation === 'player' ? '0, 255, 255' : '255, 50, 50';

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Beam head
      beamX += 25 * direction;
      
      // Add particles
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: beamX + (Math.random() * 20 - 10),
          y: (canvas.height / 2) + (Math.random() * 20 - 10),
          vx: (Math.random() * -5 * direction),
          vy: (Math.random() * 10 - 5),
          life: 1.0,
          size: Math.random() * 5 + 2
        });
      }

      // Draw Beam
      ctx.beginPath();
      ctx.moveTo(attackAnimation === 'player' ? 100 : canvas.width - 100, canvas.height / 2);
      ctx.lineTo(beamX, canvas.height / 2);
      ctx.lineWidth = 12;
      ctx.strokeStyle = "rgba(" + color + ", 0.8)";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(" + color + ", 1)";
      ctx.stroke();

      // Update and draw particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) {
          particles.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + color + ", " + p.life + ")";
          ctx.shadowBlur = 15;
          ctx.fill();
        }
      });

      if ((direction === 1 && beamX < targetX) || (direction === -1 && beamX > targetX)) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Impact explosion
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=0; i<40; i++) {
          ctx.beginPath();
          ctx.arc(targetX + (Math.random()*80-40), (canvas.height/2) + (Math.random()*80-40), Math.random()*12, 0, Math.PI*2);
          ctx.fillStyle = "rgba(" + color + ", " + Math.random() + ")";
          ctx.fill();
        }
        setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 150);
      }
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [attackAnimation]);

  return (
    <div className="relative w-full h-[350px] overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(245,158,11,0.15)] flex-shrink-0">
      {/* Animated Parallax Sky */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950 via-[#1a0f00] to-black" />
        <div className="absolute top-10 left-10 w-48 h-48 bg-orange-600 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" />
        <div className="absolute top-20 right-20 w-56 h-56 bg-red-700 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Dust Particles */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-color-dodge animate-[slide_20s_linear_infinite]" />
      </div>

      {/* HTML5 Canvas for Plasma Astra Beams */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" />

      {/* Red Damage Flash Overlay */}
      <AnimatePresence>
        {attackAnimation === 'enemy' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-600 mix-blend-overlay z-30 pointer-events-none" />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full h-full flex justify-between items-end px-4 sm:px-12 pb-8">
        
        {/* ARJUNA (Left) */}
        <div className="relative flex flex-col items-center justify-end w-32 sm:w-48">
          <motion.div animate={attackAnimation === 'player' ? { x: [0, 20, 0] } : {}} transition={{ duration: 0.3 }} className="w-full">
            {arjunaImageSrc ? (
              <img src={arjunaImageSrc} alt="Arjuna" className="w-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            ) : (
              // Procedural SVG Silhouette - Chariot & Warrior
              <svg viewBox="0 0 100 100" className="w-full drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                {/* Chariot Base */}
                <path d="M 20 80 L 80 80 L 90 60 L 10 60 Z" fill="#111" stroke="#22d3ee" strokeWidth="2" />
                {/* Spinning Wheel */}
                <g className="origin-[50px_80px] animate-[spin_1.5s_linear_infinite]">
                  <circle cx="50" cy="80" r="16" fill="none" stroke="#22d3ee" strokeWidth="3" />
                  <line x1="50" y1="64" x2="50" y2="96" stroke="#22d3ee" strokeWidth="2" />
                  <line x1="34" y1="80" x2="66" y2="80" stroke="#22d3ee" strokeWidth="2" />
                  <circle cx="50" cy="80" r="4" fill="#22d3ee" />
                </g>
                {/* Arjuna Silhouette */}
                <path d="M 30 60 L 40 20 L 50 10 L 60 20 L 50 60 Z" fill="#000" stroke="#22d3ee" strokeWidth="2" />
                {/* Gandiva Bow */}
                <path d="M 60 10 Q 85 35 60 60" fill="none" stroke="#22d3ee" strokeWidth="3" />
                <path d="M 60 10 L 60 60" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2,2" />
                {/* Divine Driver (Krishna) */}
                <path d="M 70 60 L 75 40 L 80 35 L 85 40 L 80 60 Z" fill="#000" stroke="#fff" strokeWidth="1.5" />
                <circle cx="80" cy="30" r="8" fill="none" stroke="#fbbf24" strokeWidth="2" className="animate-pulse" />
              </svg>
            )}
          </motion.div>
          <div className="absolute -bottom-6 font-black text-cyan-400 tracking-widest text-sm drop-shadow-md">ARJUNA</div>
        </div>

        {/* KARNA (Right) */}
        <div className="relative flex flex-col items-center justify-end w-32 sm:w-48">
          <motion.div animate={attackAnimation === 'enemy' ? { x: [0, -20, 0] } : {}} transition={{ duration: 0.3 }} className="w-full">
            {karnaImageSrc ? (
              <img src={karnaImageSrc} alt="Karna" className="w-full object-contain drop-shadow-[0_0_15px_rgba(225,29,72,0.5)] transform -scale-x-100" />
            ) : (
              // Procedural SVG Silhouette - Chariot & Warrior
              <svg viewBox="0 0 100 100" className="w-full drop-shadow-[0_0_15px_rgba(225,29,72,0.6)] transform -scale-x-100">
                {/* Chariot Base */}
                <path d="M 20 80 L 80 80 L 90 60 L 10 60 Z" fill="#111" stroke="#f43f5e" strokeWidth="2" />
                {/* Spinning Wheel */}
                <g className="origin-[50px_80px] animate-[spin_1.5s_linear_infinite]">
                  <circle cx="50" cy="80" r="16" fill="none" stroke="#f43f5e" strokeWidth="3" />
                  <line x1="50" y1="64" x2="50" y2="96" stroke="#f43f5e" strokeWidth="2" />
                  <line x1="34" y1="80" x2="66" y2="80" stroke="#f43f5e" strokeWidth="2" />
                  <circle cx="50" cy="80" r="4" fill="#f43f5e" />
                </g>
                {/* Karna Silhouette */}
                <path d="M 30 60 L 40 20 L 50 10 L 60 20 L 50 60 Z" fill="#000" stroke="#f43f5e" strokeWidth="2" />
                {/* Vijaya Bow */}
                <path d="M 60 10 Q 85 35 60 60" fill="none" stroke="#f43f5e" strokeWidth="3" />
                <path d="M 60 10 L 60 60" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
                {/* Sun Crown/Aura */}
                <circle cx="50" cy="5" r="15" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,4" className="animate-[spin_4s_linear_infinite] origin-[50px_5px]" />
              </svg>
            )}
          </motion.div>
          <div className="absolute -bottom-6 font-black text-rose-500 tracking-widest text-sm drop-shadow-md">KARNA</div>
        </div>
      </div>
      
      {/* CSS Injection for Parallax Slide */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
      ` }} />
    </div>
  );
}
