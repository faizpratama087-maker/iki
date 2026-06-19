/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FallingHeartsProps {
  type: 'heart' | 'rose' | 'star' | 'chocolate';
  burst?: boolean;
}

interface Particle {
  id: number;
  char: string;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

const PARTICLE_MAP = {
  heart: ['❤️', '💖', '💝', '💕', '💗'],
  rose: ['🌹', '🌸', '💐', '🥀'],
  star: ['✨', '⭐', '💫', '🌟'],
  chocolate: ['🍫', '🍬', '🍩', '🍪'],
};

export default function FallingHearts({ type, burst }: FallingHeartsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate initial continuous falling particles
    const chars = PARTICLE_MAP[type];
    const initialParticles: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      x: Math.random() * 100, // percentage x-axis
      size: Math.random() * 20 + 16, // px
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6, // speed of falling
      rotation: Math.random() * 360,
    }));
    setParticles(initialParticles);

    // Replenish particles periodically
    const interval = setInterval(() => {
      setParticles((prev) => {
        // Keep up to 35 particles
        if (prev.length > 35) {
          return prev.slice(5).concat(
            Array.from({ length: 5 }).map((_, i) => ({
              id: Date.now() + i,
              char: chars[Math.floor(Math.random() * chars.length)],
              x: Math.random() * 100,
              size: Math.random() * 20 + 16,
              delay: 0,
              duration: Math.random() * 8 + 6,
              rotation: Math.random() * 360,
            }))
          );
        }
        return prev.concat(
          Array.from({ length: 3 }).map((_, i) => ({
            id: Date.now() + i,
            char: chars[Math.floor(Math.random() * chars.length)],
            x: Math.random() * 100,
            size: Math.random() * 20 + 16,
            delay: 0,
            duration: Math.random() * 8 + 6,
            rotation: Math.random() * 360,
          }))
        );
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [type]);

  // Handle burst trigger for confetti-like moments
  useEffect(() => {
    if (burst) {
      const chars = PARTICLE_MAP[type];
      const burstParticles: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
        id: Date.now() + i + 1000,
        char: chars[Math.floor(Math.random() * chars.length)],
        x: Math.random() * 100,
        size: Math.random() * 30 + 18,
        delay: Math.random() * 0.5,
        duration: Math.random() * 4 + 3, // fast bursts
        rotation: Math.random() * 360,
      }));
      setParticles((prev) => [...prev, ...burstParticles]);
    }
  }, [burst, type]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -50, x: `${p.x}vw`, opacity: 0, rotate: 0 }}
            animate={{
              y: '105vh',
              opacity: [0, 1, 1, 0],
              rotate: [p.rotation, p.rotation + 360],
              x: `${p.x + (Math.sin(p.id) * 8)}vw`, // slight waving path
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'linear',
              repeat: Infinity,
            }}
            style={{
              position: 'absolute',
              fontSize: `${p.size}px`,
              willChange: 'transform',
            }}
          >
            {p.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
