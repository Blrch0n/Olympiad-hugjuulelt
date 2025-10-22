"use client";

import React from "react";
import Link from "next/link";

export default function PlanetHub() {
  const pages = [
    {
      title: "🎨 Full Demo",
      href: "/planet-demo",
      description: "Complete showcase with all features, sizes, and layouts",
      color: "#a855f7",
      features: [
        "All preset colors",
        "Different sizes",
        "Solar system",
        "Props docs",
      ],
    },
    {
      title: "🌌 Simple Galaxy",
      href: "/simple-galaxy",
      description: "Your Olympiad page with CSS planets (production ready)",
      color: "#3b82f6",
      features: ["Hub view", "Detail view", "Navigation", "Real content"],
    },
    {
      title: "⚡ Quick Examples",
      href: "/quick-demo",
      description: "Copy-paste ready examples with code snippets",
      color: "#14b8a6",
      features: ["Basic usage", "Animations", "Interactions", "Layouts"],
    },
    {
      title: "🚀 Original 3D",
      href: "/",
      description: "Three.js version (heavier, but cool 3D effects)",
      color: "#f97316",
      features: ["3D planets", "Warp animation", "Orbit rings", "WebGL"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center py-24 px-4">
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-linear-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            🪐 Glossy Planets
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            CSS-only neon planets • Zero dependencies
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Beautiful, performant, and easy to use. Pick a demo below to
            explore!
          </p>
        </div>
      </div>

      {/* Demo cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group relative bg-slate-900/50 backdrop-blur rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                boxShadow: `0 0 0 rgba(0,0,0,0)`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 40px ${page.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
              }}
            >
              {/* Planet icon */}
              <div className="mb-6">
                <div
                  className="w-20 h-20 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${page.color}ff 0%, ${page.color}dd 30%, ${page.color}88 60%, ${page.color}33 100%)`,
                    boxShadow: `
                      inset -4px -4px 12px rgba(0,0,0,0.6),
                      inset 2px 2px 6px rgba(255,255,255,0.15),
                      0 0 30px ${page.color}40
                    `,
                  }}
                >
                  <div
                    className="absolute w-8 h-8 top-3 left-3 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)",
                      filter: "blur(6px)",
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-3xl font-bold mb-3 group-hover:scale-105 transition-transform">
                {page.title}
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {page.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {page.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke={page.color}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Arrow */}
              <div className="absolute bottom-8 right-8 text-gray-500 group-hover:text-white group-hover:translate-x-2 transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Component options */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/10">
        <h2 className="text-4xl font-bold text-center mb-12">
          Choose Your Component
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-purple-400">
              GlossyPlanet
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Full-featured component with all the bells and whistles
            </p>
            <pre className="text-xs bg-slate-950 rounded p-3 overflow-x-auto">
              <code>import GlossyPlanet from '@/components/GlossyPlanet';</code>
            </pre>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-blue-400">
              StandalonePlanet
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Self-contained, no external dependencies needed
            </p>
            <pre className="text-xs bg-slate-950 rounded p-3 overflow-x-auto">
              <code>
                import StandalonePlanet from '@/components/StandalonePlanet';
              </code>
            </pre>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-teal-400">
              QuickPlanet
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Inline function, paste anywhere - simplest option
            </p>
            <pre className="text-xs bg-slate-950 rounded p-3 overflow-x-auto">
              <code>
                import {`{QuickPlanet}`} from
                '@/components/QuickPlanetExamples';
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
            <div className="text-sm text-gray-500">Dependencies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">~5KB</div>
            <div className="text-sm text-gray-500">Total Size</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-teal-400 mb-2">60fps</div>
            <div className="text-sm text-gray-500">Smooth Animation</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-400 mb-2">100%</div>
            <div className="text-sm text-gray-500">CSS Only</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-12 px-4 border-t border-white/10">
        <p className="text-gray-500 mb-4">
          ✨ Built with CSS gradients, shadows, and love
        </p>
        <p className="text-sm text-gray-600">
          No Three.js • No Canvas • No WebGL • Just pure CSS magic
        </p>
      </footer>
    </div>
  );
}
