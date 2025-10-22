"use client";

import React from "react";
import {
  QuickPlanet,
  SolarSystem,
  PlanetGrid,
} from "@/components/QuickPlanetExamples";

export default function QuickDemo() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="text-center py-16 px-4 border-b border-white/10">
        <h1 className="text-6xl font-black mb-4 bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Quick Planet Examples
        </h1>
        <p className="text-xl text-gray-400">
          Copy-paste ready CSS planets • No setup required
        </p>
      </div>

      {/* Example 1: Basic */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">1. Basic Planets</h2>
          <div className="bg-slate-900/50 rounded-2xl p-12 border border-white/10">
            <div className="flex justify-center gap-6 flex-wrap">
              <QuickPlanet color="#a855f7" size={80} />
              <QuickPlanet color="#3b82f6" size={100} />
              <QuickPlanet color="#14b8a6" size={120} />
              <QuickPlanet color="#f97316" size={100} />
              <QuickPlanet color="#10b981" size={80} />
            </div>
          </div>
          <pre className="mt-4 bg-slate-900 rounded-xl p-4 overflow-x-auto text-sm">
            <code>{`<QuickPlanet color="#a855f7" size={120} />`}</code>
          </pre>
        </div>
      </section>

      {/* Example 2: With hover */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            2. Interactive (Hover Me!)
          </h2>
          <div className="bg-slate-900/50 rounded-2xl p-12 border border-white/10">
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="cursor-pointer hover:scale-125 transition-transform duration-300">
                <QuickPlanet color="#ec4899" size={120} />
              </div>
              <div className="cursor-pointer hover:scale-125 hover:rotate-12 transition-all duration-300">
                <QuickPlanet color="#8b5cf6" size={120} />
              </div>
              <div className="cursor-pointer hover:scale-125 hover:-rotate-12 transition-all duration-300">
                <QuickPlanet color="#06b6d4" size={120} />
              </div>
            </div>
          </div>
          <pre className="mt-4 bg-slate-900 rounded-xl p-4 overflow-x-auto text-sm">
            <code>{`<div className="hover:scale-125 transition-transform">
  <QuickPlanet color="#ec4899" size={120} />
</div>`}</code>
          </pre>
        </div>
      </section>

      {/* Example 3: Animated */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">3. Animated</h2>
          <div className="bg-slate-900/50 rounded-2xl p-12 border border-white/10">
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="animate-pulse">
                <QuickPlanet color="#f59e0b" size={100} />
              </div>
              <div className="animate-bounce">
                <QuickPlanet color="#ef4444" size={100} />
              </div>
              <div className="animate-spin" style={{ animationDuration: "3s" }}>
                <QuickPlanet color="#14b8a6" size={100} />
              </div>
            </div>
          </div>
          <pre className="mt-4 bg-slate-900 rounded-xl p-4 overflow-x-auto text-sm">
            <code>{`<div className="animate-pulse">
  <QuickPlanet color="#f59e0b" size={100} />
</div>`}</code>
          </pre>
        </div>
      </section>

      {/* Example 4: With labels */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">4. With Labels</h2>
          <div className="bg-slate-900/50 rounded-2xl p-12 border border-white/10">
            <div className="flex justify-center gap-12 flex-wrap">
              {[
                { color: "#a855f7", label: "Prizes" },
                { color: "#3b82f6", label: "About" },
                { color: "#14b8a6", label: "Contact" },
                { color: "#f97316", label: "Register" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <QuickPlanet color={item.color} size={100} />
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: item.color,
                      textShadow: `0 0 12px ${item.color}99`,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <pre className="mt-4 bg-slate-900 rounded-xl p-4 overflow-x-auto text-sm">
            <code>{`<div className="flex flex-col items-center gap-3">
  <QuickPlanet color="#a855f7" size={100} />
  <span>Label</span>
</div>`}</code>
          </pre>
        </div>
      </section>

      {/* Example 5: Click handler */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">5. Clickable (Try It!)</h2>
          <div className="bg-slate-900/50 rounded-2xl p-12 border border-white/10">
            <div className="flex justify-center gap-8 flex-wrap">
              <div
                onClick={() => alert("Purple planet clicked! 🪐")}
                className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <QuickPlanet color="#a855f7" size={120} />
              </div>
              <div
                onClick={() => alert("Blue planet clicked! 🌍")}
                className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              >
                <QuickPlanet color="#3b82f6" size={120} />
              </div>
            </div>
          </div>
          <pre className="mt-4 bg-slate-900 rounded-xl p-4 overflow-x-auto text-sm">
            <code>{`<div onClick={() => alert('Clicked!')}>
  <QuickPlanet color="#a855f7" size={120} />
</div>`}</code>
          </pre>
        </div>
      </section>

      {/* Example 6: Solar System */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            6. Solar System Layout
          </h2>
          <div className="bg-slate-900/50 rounded-2xl p-8 border border-white/10">
            <SolarSystem />
          </div>
        </div>
      </section>

      {/* Example 7: Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            7. Grid Layout
          </h2>
          <div className="bg-slate-900/50 rounded-2xl p-8 border border-white/10">
            <PlanetGrid />
          </div>
        </div>
      </section>

      {/* Copy-paste code */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📋 Copy-Paste This Anywhere
          </h2>
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
            <pre className="overflow-x-auto text-sm">
              <code className="text-gray-300">{`// Paste this function anywhere!
const QuickPlanet = ({ color = '#a855f7', size = 120 }) => (
  <div style={{ 
    width: size, 
    height: size, 
    borderRadius: '50%',
    background: \`radial-gradient(circle at 35% 35%, 
      \${color}ff 0%, \${color}dd 30%, \${color}88 60%, \${color}33 100%)\`,
    boxShadow: \`
      inset -8px -8px 24px rgba(0,0,0,0.6),
      inset 4px 4px 12px rgba(255,255,255,0.15),
      0 0 40px \${color}40
    \`,
    position: 'relative'
  }}>
    <div style={{
      position: 'absolute',
      top: '15%',
      left: '20%',
      width: '35%',
      height: '35%',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)',
      filter: 'blur(8px)'
    }} />
  </div>
);

// Use it:
<QuickPlanet color="#a855f7" size={120} />`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 border-t border-white/10">
        <p>✨ Pure CSS • Zero dependencies • Copy-paste ready</p>
      </footer>
    </div>
  );
}
