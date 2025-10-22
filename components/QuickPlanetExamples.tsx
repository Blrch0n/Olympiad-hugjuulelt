/**
 * 🚀 QUICKEST START - Inline CSS Planet
 * No imports needed (except React)
 * Literally just copy-paste this function anywhere!
 */

import React from "react";

// Paste this anywhere and it works!
export const QuickPlanet = ({
  color = "#a855f7",
  size = 120,
}: {
  color?: string;
  size?: number;
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 35%, ${color}ff 0%, ${color}dd 30%, ${color}88 60%, ${color}33 100%)`,
      boxShadow: `
      inset -8px -8px 24px rgba(0,0,0,0.6),
      inset 4px 4px 12px rgba(255,255,255,0.15),
      0 0 40px ${color}40
    `,
      position: "relative",
    }}
  >
    {/* Glossy highlight */}
    <div
      style={{
        position: "absolute",
        top: "15%",
        left: "20%",
        width: "35%",
        height: "35%",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)",
        filter: "blur(8px)",
      }}
    />
  </div>
);

// Example 1: Simple usage
export function Example1() {
  return (
    <div className="flex gap-4 p-8 bg-slate-900">
      <QuickPlanet color="#a855f7" size={100} />
      <QuickPlanet color="#3b82f6" size={120} />
      <QuickPlanet color="#14b8a6" size={140} />
    </div>
  );
}

// Example 2: With click handler
export function Example2() {
  return (
    <div
      onClick={() => alert("Clicked!")}
      className="cursor-pointer hover:scale-110 transition-transform"
    >
      <QuickPlanet color="#f97316" size={150} />
    </div>
  );
}

// Example 3: Animated
export function Example3() {
  return (
    <div className="animate-pulse">
      <QuickPlanet color="#ec4899" size={120} />
    </div>
  );
}

// Example 4: Solar system (copy-paste ready!)
export function SolarSystem() {
  const planets = [
    { color: "#a855f7", size: 80 },
    { color: "#3b82f6", size: 100 },
    { color: "#14b8a6", size: 90 },
    { color: "#f97316", size: 110 },
    { color: "#10b981", size: 95 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="relative w-[600px] h-[600px]">
        {/* Sun in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <QuickPlanet color="#ff9500" size={120} />
        </div>

        {/* Planets in orbit */}
        {planets.map((planet, i) => {
          const angle = (i / planets.length) * Math.PI * 2;
          const radius = 220;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 cursor-pointer hover:scale-125 transition-transform"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <QuickPlanet color={planet.color} size={planet.size} />
            </div>
          );
        })}

        {/* Orbit ring */}
        <div className="absolute inset-0 m-auto w-[440px] h-[440px] rounded-full border border-white/10" />
      </div>
    </div>
  );
}

// Example 5: Grid layout
export function PlanetGrid() {
  const colors = [
    "#a855f7",
    "#3b82f6",
    "#14b8a6",
    "#f97316",
    "#10b981",
    "#ec4899",
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
        {colors.map((color, i) => (
          <div
            key={i}
            className="flex justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            <QuickPlanet color={color} size={120} />
          </div>
        ))}
      </div>
    </div>
  );
}

/*
 * 💡 USAGE TIPS:
 *
 * 1. Copy QuickPlanet function anywhere
 * 2. Use inline: <QuickPlanet color="#a855f7" size={120} />
 * 3. Add hover effects with Tailwind classes
 * 4. Wrap in onClick div for interactivity
 * 5. That's it!
 *
 * Want more features? Use GlossyPlanet.tsx instead
 * This is just for quick prototyping!
 */
