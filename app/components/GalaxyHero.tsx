"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { SectionId, Mode } from "@/app/lib/galaxy-types";
import {
  PLANET_CONFIGS,
  ORDERED_SECTIONS,
  TEXTURE_CONFIG,
  PERFORMANCE,
} from "@/app/lib/galaxy-constants";
import {
  GalaxyScene,
  TopBar,
  ShowcasePanel,
  ProgressIndicator,
  WebGLNotSupported,
} from "./galaxy";

export default function GalaxyHero() {
  const [mode, setMode] = useState<Mode>("hub");
  const [current, setCurrent] = useState<SectionId | null>(null);
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentSection, setCurrentSection] = useState(-1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);

  const planetRefsMap = useMemo(() => {
    const refs = {} as Record<SectionId, React.RefObject<THREE.Group | null>>;
    PLANET_CONFIGS.forEach((p) => {
      refs[p.id as SectionId] = React.createRef<THREE.Group | null>();
    });
    return refs;
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    PLANET_CONFIGS.forEach((p) => {
      const tex = TEXTURE_CONFIG[p.id];
      if (tex?.albedo) {
        useTexture.preload(tex.albedo);
      }
    });
    useTexture.preload("/textures/8k_sun.webp");
  }, []);

  const onPick = React.useCallback((id: SectionId, worldPos: THREE.Vector3) => {
    setCurrent(id);
    setTarget(worldPos);
    setMode("warping-to");
    const sectionIndex = ORDERED_SECTIONS.indexOf(id);
    if (sectionIndex !== -1) {
      setCurrentSection(sectionIndex);
    }
  }, []);

  const onBack = React.useCallback(() => {
    setCurrent(null);
    setTarget(null);
    setMode("warping-back");
    setCurrentSection(-1);
  }, []);

  const navigateToSection = React.useCallback(
    (index: number) => {
      if (isScrollingRef.current) return;

      isScrollingRef.current = true;
      setCurrentSection(index);

      if (index >= 0 && index < ORDERED_SECTIONS.length) {
        const sectionId = ORDERED_SECTIONS[index];
        const planetRef = planetRefsMap[sectionId];

        if (planetRef?.current) {
          const meshRef = planetRef.current.userData?.meshRef;

          if (meshRef) {
            const pos = new THREE.Vector3();
            meshRef.getWorldPosition(pos);
            onPick(sectionId, pos);
          } else {
            isScrollingRef.current = false;
          }
        } else {
          isScrollingRef.current = false;
        }
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1200);
    },
    [onPick, planetRefsMap]
  );

  const onNavClick = React.useCallback(
    (id: SectionId) => {
      if (mode === "warping-to" || mode === "warping-back") {
        setTimeout(() => {
          const planetRef = planetRefsMap[id];
          if (planetRef?.current) {
            const meshRef = planetRef.current.userData?.meshRef;
            if (meshRef) {
              const pos = new THREE.Vector3();
              meshRef.getWorldPosition(pos);
              onPick(id, pos);
              const sectionIndex = ORDERED_SECTIONS.indexOf(id);
              if (sectionIndex !== -1) setCurrentSection(sectionIndex);
            }
          }
        }, 600);
        return;
      }

      if (current === id && mode === "panel") {
        onBack();
        return;
      }

      requestAnimationFrame(() => {
        const planetRef = planetRefsMap[id];
        if (planetRef?.current) {
          const meshRef = planetRef.current.userData?.meshRef;
          if (meshRef) {
            const pos = new THREE.Vector3();
            meshRef.getWorldPosition(pos);
            onPick(id, pos);
            const sectionIndex = ORDERED_SECTIONS.indexOf(id);
            if (sectionIndex !== -1) {
              setCurrentSection(sectionIndex);
            }
          }
        }
      });
    },
    [mode, current, onBack, onPick, planetRefsMap]
  );

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) setWebglSupported(false);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode === "panel") onBack();
      if (e.key === "ArrowDown" && !isScrollingRef.current) {
        e.preventDefault();
        if (currentSection < ORDERED_SECTIONS.length - 1) {
          navigateToSection(
            Math.min(currentSection + 1, ORDERED_SECTIONS.length - 1)
          );
        } else {
          onBack();
        }
      }
      if (e.key === "ArrowUp" && !isScrollingRef.current) {
        e.preventDefault();
        if (currentSection > 0) {
          navigateToSection(Math.max(currentSection - 1, 0));
        } else {
          onBack();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [mode, currentSection, onBack, navigateToSection]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (
        isScrollingRef.current ||
        mode === "warping-to" ||
        mode === "warping-back"
      ) {
        return;
      }

      if (Math.abs(e.deltaY) < PERFORMANCE.SCROLL_THRESHOLD) {
        return;
      }

      e.preventDefault();

      if (e.deltaY > 0 && currentSection < ORDERED_SECTIONS.length - 1) {
        navigateToSection(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > -1) {
        if (currentSection === -1 || currentSection === 0) {
          onBack();
        } else {
          navigateToSection(currentSection - 1);
        }
      } else if (
        e.deltaY > 0 &&
        currentSection === ORDERED_SECTIONS.length - 1
      ) {
        onBack();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection, mode, navigateToSection, onBack]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".showcase-panel-content") || target.closest("nav")) {
        return;
      }

      touchStartYRef.current = e.touches[0].clientY;
      touchStartTimeRef.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".showcase-panel-content") || target.closest("nav")) {
        return;
      }

      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".showcase-panel-content") || target.closest("nav")) {
        return;
      }

      if (
        touchStartYRef.current === null ||
        touchStartTimeRef.current === null
      ) {
        return;
      }

      if (
        isScrollingRef.current ||
        mode === "warping-to" ||
        mode === "warping-back"
      ) {
        touchStartYRef.current = null;
        touchStartTimeRef.current = null;
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartYRef.current - touchEndY;
      const deltaTime = Date.now() - touchStartTimeRef.current;
      const velocity = Math.abs(deltaY) / deltaTime;

      const SWIPE_THRESHOLD = 50;
      const VELOCITY_THRESHOLD = 0.5;

      if (Math.abs(deltaY) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
        if (deltaY > 0 && currentSection < ORDERED_SECTIONS.length - 1) {
          navigateToSection(currentSection + 1);
        } else if (
          deltaY > 0 &&
          currentSection === ORDERED_SECTIONS.length - 1
        ) {
          onBack();
        } else if (deltaY < 0 && currentSection > -1) {
          if (currentSection === -1 || currentSection === 0) {
            onBack();
          } else {
            navigateToSection(currentSection - 1);
          }
        }
      }

      touchStartYRef.current = null;
      touchStartTimeRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSection, mode, navigateToSection, onBack]);

  if (!webglSupported) return <WebGLNotSupported />;

  return (
    <div className="h-screen w-screen overflow-hidden text-white relative">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {mode === "panel" &&
          current &&
          `Viewing ${TEXTURE_CONFIG[current]?.label}`}
        {mode === "hub" &&
          "Solar system view. Use arrow keys to navigate between planets."}
      </div>

      <div className="sr-only">
        <p>Keyboard shortcuts:</p>
        <ul>
          <li>Arrow Down: Next section</li>
          <li>Arrow Up: Previous section</li>
          <li>Escape: Return to home</li>
        </ul>
      </div>

      <div
        className={`galaxy-bg ${isLoaded ? "stars-visible" : "stars-hidden"}`}
      >
        <div className="stars-layer" />
        <div className="glow-blue" />
        <div className="glow-magenta" />
        <div className="vignette" />
      </div>

      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <GalaxyScene
          mode={mode}
          target={target}
          setMode={setMode}
          currentPlanetRef={current ? planetRefsMap[current] : null}
          onPick={onPick}
          onBack={onBack}
          planetRefsMap={planetRefsMap}
          reducedMotion={reducedMotion}
          onLoadingComplete={() => {
            setIsLoaded(true);
            setIsLoading(false);
          }}
        />
      </div>

      {mode === "panel" && current && (
        <ShowcasePanel id={current} onBack={onBack} />
      )}

      <TopBar
        current={current}
        mode={mode}
        onBack={onBack}
        onNavClick={onNavClick}
      />

      <ProgressIndicator
        currentSection={currentSection}
        isLoaded={isLoaded}
        mode={mode}
        onNavigate={navigateToSection}
        isScrolling={isScrollingRef.current}
      />

      {isLoaded && (
        <div className="absolute bottom-4 left-4 md:hidden text-xs text-gray-400 bg-slate-900/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
          Swipe up/down or tap planets
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        @keyframes menuItem {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-menuItem {
          animation: menuItem 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}
