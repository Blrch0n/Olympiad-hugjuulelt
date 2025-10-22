import React from "react";

interface GlossyPlanetProps {
  color: string;
  size?: number;
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

/**
 * CSS-only glossy neon planet disc
 * Zero dependencies, pure CSS magic
 */
export default function GlossyPlanet({
  color,
  size = 120,
  label,
  onClick,
  isActive = false,
  className = "",
}: GlossyPlanetProps) {
  return (
    <div
      className={`relative inline-flex flex-col items-center gap-3 transition-transform duration-300 ${
        isActive ? "scale-110" : "scale-100 hover:scale-105"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      style={{
        filter: isActive ? `drop-shadow(0 0 30px ${color}80)` : "none",
      }}
    >
      {/* Planet disc container */}
      <div
        className="relative transition-all duration-300"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Main planet body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, 
              ${color}ff 0%, 
              ${color}dd 30%, 
              ${color}88 60%, 
              ${color}33 100%)`,
            boxShadow: `
              inset -8px -8px 24px rgba(0,0,0,0.6),
              inset 4px 4px 12px rgba(255,255,255,0.15),
              0 0 40px ${color}40,
              0 0 60px ${color}20
            `,
          }}
        />

        {/* Glossy highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: "15%",
            left: "20%",
            width: "35%",
            height: "35%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Secondary shine */}
        <div
          className="absolute rounded-full"
          style={{
            top: "25%",
            left: "30%",
            width: "20%",
            height: "20%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(4px)",
          }}
        />

        {/* Atmospheric glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, 
              transparent 65%, 
              ${color}40 75%, 
              transparent 85%)`,
            filter: "blur(6px)",
          }}
        />

        {/* Outer neon glow */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -8,
            background: `radial-gradient(circle, 
              transparent 60%, 
              ${color}30 70%, 
              ${color}10 80%,
              transparent 90%)`,
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />

        {/* Pulsing animation for active state */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: `radial-gradient(circle, transparent 60%, ${color}20 80%, transparent 100%)`,
            }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <div
          className={`text-sm font-bold whitespace-nowrap transition-all duration-300 ${
            isActive ? "scale-110" : "scale-100"
          }`}
          style={{
            color: isActive ? color : "#fff",
            textShadow: `0 0 12px ${color}99, 0 2px 8px rgba(0,0,0,0.8)`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// Example usage with preset colors:
export const PlanetPresets = {
  purple: "#a855f7",
  blue: "#3b82f6",
  teal: "#14b8a6",
  orange: "#f97316",
  green: "#10b981",
  cyan: "#06b6d4",
  pink: "#ec4899",
  red: "#ef4444",
  yellow: "#eab308",
};
