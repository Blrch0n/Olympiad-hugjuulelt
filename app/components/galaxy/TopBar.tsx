"use client";

import React, { useState } from "react";
import { SectionId, Mode } from "@/app/lib/galaxy-types";
import { TEXTURE_CONFIG, ORDERED_SECTIONS } from "@/app/lib/galaxy-constants";

interface TopBarProps {
  current: SectionId | null;
  mode: Mode;
  onBack: () => void;
  onNavClick: (id: SectionId) => void;
}

export default function TopBar({
  current,
  mode,
  onBack,
  onNavClick,
}: TopBarProps) {
  const isBusy = mode === "warping-to" || mode === "warping-back";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/50 via-black/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between py-4 pointer-events-auto">
            <button
              className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onBack}
            >
              <img
                src="/textures/syslogo.svg"
                alt="Logo"
                className="h-8 md:h-16 w-auto"
              />
            </button>

            <ul className="hidden md:flex items-center gap-6 lg:gap-8 ml-auto">
              {ORDERED_SECTIONS.map((id) => {
                const label = TEXTURE_CONFIG[id].label;
                const active = current === id;

                return (
                  <li key={id}>
                    <button
                      onClick={() => onNavClick(id)}
                      disabled={isBusy}
                      className={`relative cursor-pointer text-sm font-semibold tracking-wider uppercase transition-all duration-200 group ${
                        active
                          ? "text-cyan-400"
                          : "text-white/70 hover:text-white"
                      } ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {label}
                      <span
                        className={`absolute left-0 right-0 -bottom-1 h-0.5 bg-cyan-400 rounded-full transition-all duration-200 ${
                          active
                            ? "opacity-100 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                            : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-auto p-2 text-white hover:text-cyan-400 transition-colors relative"
              style={{ zIndex: 70 }}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 md:hidden pointer-events-auto"
          style={{ zIndex: 60 }}
        >
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative h-full w-full flex flex-col items-center justify-center p-8 animate-slideIn">
            <div className="w-full max-w-md space-y-2">
              {ORDERED_SECTIONS.map((id, index) => {
                const label = TEXTURE_CONFIG[id].label;
                const active = current === id;
                const planet = TEXTURE_CONFIG[id];

                return (
                  <button
                    key={id}
                    onClick={() => {
                      onNavClick(id);
                      setMobileMenuOpen(false);
                    }}
                    disabled={isBusy}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                    className={`w-full text-center px-8 py-5 text-lg font-bold uppercase tracking-wider transition-all rounded-2xl animate-menuItem ${
                      active
                        ? "text-cyan-400 bg-cyan-400/20 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        : "text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border-2 border-white/10"
                    } ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: planet.color,
                          boxShadow: active
                            ? `0 0 12px ${planet.color}`
                            : "none",
                          opacity: active ? 1 : 0.5,
                        }}
                      />
                      {label}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-8 text-white/40 text-sm">
              Tap anywhere to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
