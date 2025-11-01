"use client";

import React from "react";
import { SectionId } from "@/app/lib/galaxy-types";
import { TEXTURE_CONFIG, ORDERED_SECTIONS } from "@/app/lib/galaxy-constants";

interface ProgressIndicatorProps {
  currentSection: number;
  isLoaded: boolean;
  mode: "hub" | "warping-to" | "panel" | "warping-back";
  onNavigate: (index: number) => void;
  isScrolling: boolean;
}

export default function ProgressIndicator({
  currentSection,
  isLoaded,
  mode,
  onNavigate,
  isScrolling,
}: ProgressIndicatorProps) {
  if (!isLoaded) return null;

  return (
    <div className="absolute z-30 bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3">
      <div className="flex items-center gap-1.5 md:gap-2 bg-slate-900/70 px-3 md:px-4 py-2 md:py-3 rounded-full backdrop-blur-sm border border-white/10">
        {ORDERED_SECTIONS.map((section, index) => {
          const planet = TEXTURE_CONFIG[section];
          const isActive = index === currentSection;
          const isPast = index < currentSection;

          return (
            <button
              key={section}
              onClick={() => {
                if (index !== currentSection) {
                  onNavigate(index);
                }
              }}
              className="relative flex flex-col items-center pointer-events-auto cursor-pointer group transition-transform hover:scale-110 active:scale-95"
              disabled={
                isScrolling || mode === "warping-to" || mode === "warping-back"
              }
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-3 h-3 md:w-4 md:h-4 ring-1 md:ring-2 ring-white/50 ring-offset-1 md:ring-offset-2 ring-offset-slate-900/50"
                    : "w-2 h-2 md:w-2.5 md:h-2.5 group-hover:w-2.5 group-hover:h-2.5 md:group-hover:w-3 md:group-hover:h-3"
                }`}
                style={{
                  backgroundColor: planet.color,
                  opacity:
                    isPast || currentSection === -1 ? 0.6 : isActive ? 1 : 0.3,
                  boxShadow: isActive
                    ? `0 0 8px ${planet.color}, 0 0 16px ${planet.color}40`
                    : "none",
                }}
              />
              {isActive && (
                <div
                  className="absolute -bottom-5 md:-bottom-6 text-[10px] md:text-xs font-medium whitespace-nowrap pointer-events-none"
                  style={{ color: planet.color }}
                >
                  {planet.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {mode === "hub" && currentSection < ORDERED_SECTIONS.length - 1 && (
        <>
          <div className="hidden md:flex flex-col items-center animate-bounce mt-2 pointer-events-none">
            <div className="text-white/50 text-xs mb-1">Доош гүйлгэх</div>
            <svg
              className="w-5 h-5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <div className="md:hidden flex flex-col items-center animate-bounce pointer-events-none">
            <div className="text-white/50 text-[10px] mb-1">Гүйлгэх</div>
            <svg
              className="w-4 h-4 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
