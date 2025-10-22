/**
 * 🪐 STANDALONE GLOSSY PLANET
 * Copy this entire file and it just works!
 * Zero dependencies, pure CSS magic
 *
 * Usage:
 * <StandalonePlanet color="#a855f7" size={120} label="My Planet" />
 */

import React from "react";

interface StandalonePlanetProps {
  /** Hex color (e.g., "#a855f7", "#3b82f6") */
  color: string;
  /** Diameter in pixels */
  size?: number;
  /** Text label below planet */
  label?: string;
  /** Click handler */
  onClick?: () => void;
  /** Active/selected state */
  isActive?: boolean;
}

export default function StandalonePlanet({
  color,
  size = 120,
  label,
  onClick,
  isActive = false,
}: StandalonePlanetProps) {
  const cursorStyle = onClick ? "cursor-pointer" : "";
  const scaleStyle = isActive ? "scale-110" : "hover:scale-105";

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center gap-3 transition-transform duration-300 ${scaleStyle} ${cursorStyle}`}
      style={{
        filter: isActive ? `drop-shadow(0 0 30px ${color}80)` : "none",
      }}
    >
      {/* Planet */}
      <div style={{ width: size, height: size, position: "relative" }}>
        {/* Base sphere with gradient and glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${color}ff 0%, ${color}dd 30%, ${color}88 60%, ${color}33 100%)`,
            boxShadow: `
              inset -8px -8px 24px rgba(0,0,0,0.6),
              inset 4px 4px 12px rgba(255,255,255,0.15),
              0 0 40px ${color}40,
              0 0 60px ${color}20
            `,
          }}
        />

        {/* Main highlight */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "20%",
            width: "35%",
            height: "35%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Secondary shine */}
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "30%",
            width: "20%",
            height: "20%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(4px)",
          }}
        />

        {/* Atmospheric ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, transparent 65%, ${color}40 75%, transparent 85%)`,
            filter: "blur(6px)",
          }}
        />

        {/* Outer glow */}
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            background: `radial-gradient(circle, transparent 60%, ${color}30 70%, ${color}10 80%, transparent 90%)`,
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />

        {/* Pulse animation for active */}
        {isActive && (
          <div
            className="animate-ping"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle, transparent 60%, ${color}20 80%, transparent 100%)`,
            }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <div
          className={`text-sm font-bold whitespace-nowrap transition-all duration-300 ${
            isActive ? "scale-110" : ""
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

// Quick preset colors
export const PlanetColors = {
  purple: "#a855f7",
  blue: "#3b82f6",
  teal: "#14b8a6",
  orange: "#f97316",
  green: "#10b981",
  cyan: "#06b6d4",
  pink: "#ec4899",
  red: "#ef4444",
  yellow: "#eab308",
  indigo: "#6366f1",
};

// Example usage:
/*
import StandalonePlanet, { PlanetColors } from './StandalonePlanet';

function MyComponent() {
  return (
    <div className="flex gap-8">
      <StandalonePlanet 
        color={PlanetColors.purple} 
        size={140} 
        label="Click me!"
        onClick={() => alert('Hello!')}
      />
      
      <StandalonePlanet 
        color="#ff6b9d" 
        size={100} 
        isActive={true}
      />
    </div>
  );
}
*/
