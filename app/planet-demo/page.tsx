"use client";

import React, { useState } from "react";
import GlossyPlanet, { PlanetPresets } from "@/components/GlossyPlanet";

/**
 * Demo page showing how to use the GlossyPlanet component
 */
export default function PlanetDemo() {
  const [active, setActive] = useState<string | null>(null);

  const sections = [
    { id: "about", label: "Олимпиадын тухай", color: PlanetPresets.green },
    { id: "rules", label: "Шалгалт", color: PlanetPresets.orange },
    { id: "prizes", label: "Шагналын сан", color: PlanetPresets.purple },
    { id: "sponsor", label: "Ивээн тэтгэч", color: PlanetPresets.blue },
    { id: "contact", label: "Холбоо барих", color: PlanetPresets.cyan },
    { id: "register", label: "Бүртгүүлэх", color: PlanetPresets.teal },
    { id: "faq", label: "Асуулт", color: PlanetPresets.pink },
  ];

  return (
    <div className="min-h-screen bg-[#060a18] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Glossy Neon Planets 🪐
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Click any planet to see the active state
        </p>

        {/* Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
          {sections.map((section) => (
            <div key={section.id} className="flex justify-center">
              <GlossyPlanet
                color={section.color}
                size={140}
                label={section.label}
                isActive={active === section.id}
                onClick={() =>
                  setActive(section.id === active ? null : section.id)
                }
              />
            </div>
          ))}
        </div>

        {/* Different sizes demo */}
        <div className="border-t border-white/10 pt-12 mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Different Sizes
          </h2>
          <div className="flex justify-center items-end gap-8 flex-wrap">
            <GlossyPlanet
              color={PlanetPresets.purple}
              size={80}
              label="Small"
            />
            <GlossyPlanet
              color={PlanetPresets.blue}
              size={120}
              label="Medium"
            />
            <GlossyPlanet color={PlanetPresets.teal} size={160} label="Large" />
            <GlossyPlanet color={PlanetPresets.orange} size={200} label="XL" />
          </div>
        </div>

        {/* Code example */}
        <div className="border-t border-white/10 pt-12 mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Usage</h2>
          <pre className="bg-slate-900/50 border border-white/10 rounded-xl p-6 overflow-x-auto">
            <code className="text-sm text-gray-300">{`import GlossyPlanet, { PlanetPresets } from '@/components/GlossyPlanet';

// Basic usage
<GlossyPlanet 
  color="#a855f7" 
  size={120} 
  label="My Planet" 
/>

// With preset colors
<GlossyPlanet 
  color={PlanetPresets.purple} 
  size={140} 
  label="Шагналын сан"
  isActive={true}
  onClick={() => console.log('Clicked!')}
/>

// Custom hex color
<GlossyPlanet 
  color="#ff6b9d" 
  size={100} 
/>
`}</code>
          </pre>
        </div>

        {/* Solar system demo */}
        <div className="border-t border-white/10 pt-12 mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Solar System Layout
          </h2>
          <div className="relative h-[600px] flex items-center justify-center">
            {/* Sun in center */}
            <div className="absolute">
              <GlossyPlanet color="#ff9500" size={100} label="☀️ Нүүр" />
            </div>

            {/* Planets in orbit */}
            {sections.map((section, index) => {
              const angle = (index / sections.length) * Math.PI * 2;
              const radius = 220;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={section.id}
                  className="absolute transition-all duration-500"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <GlossyPlanet
                    color={section.color}
                    size={80}
                    label={section.label}
                    isActive={active === section.id}
                    onClick={() =>
                      setActive(section.id === active ? null : section.id)
                    }
                  />
                </div>
              );
            })}

            {/* Orbit ring */}
            <div
              className="absolute rounded-full border border-white/10"
              style={{
                width: 440,
                height: 440,
              }}
            />
          </div>
        </div>

        {/* Props documentation */}
        <div className="border-t border-white/10 pt-12 mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Props</h2>
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4">Prop</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Default</th>
                  <th className="text-left py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 font-mono text-cyan-400">color</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">Hex color (e.g., "#a855f7")</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 font-mono text-cyan-400">size</td>
                  <td className="py-3 px-4">number</td>
                  <td className="py-3 px-4">120</td>
                  <td className="py-3 px-4">Planet diameter in pixels</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 font-mono text-cyan-400">label</td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">Text label below planet</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 font-mono text-cyan-400">onClick</td>
                  <td className="py-3 px-4">function</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4">Click handler</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 font-mono text-cyan-400">
                    isActive
                  </td>
                  <td className="py-3 px-4">boolean</td>
                  <td className="py-3 px-4">false</td>
                  <td className="py-3 px-4">Active/selected state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-cyan-400">
                    className
                  </td>
                  <td className="py-3 px-4">string</td>
                  <td className="py-3 px-4">""</td>
                  <td className="py-3 px-4">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
