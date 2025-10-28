"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  forwardRef,
  Suspense,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, ThreeEvent, useThree } from "@react-three/fiber";
import {
  Html,
  Line,
  Billboard,
  useProgress,
  useTexture,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  SectionId,
  Mode,
  PlanetProps,
  CameraRigProps,
  ShowcaseProps,
} from "@/lib/galaxy-types";
import {
  SECTION_CONTENT,
  TEXTURE_CONFIG,
  PLANET_CONFIGS,
  ORDERED_SECTIONS,
  PERFORMANCE,
} from "@/lib/galaxy-constants";
import { PANEL_COMPONENTS } from "./panels/panel-mapper";

function Sun({ onClick }: { onClick?: () => void }) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const sunTexture = useTexture("/textures/8k_sun.jpg");

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.05;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <group onClick={handleClick}>
      <mesh scale={1.3} ref={coreRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#ffaa00"
          emissiveIntensity={1.5}
          emissiveMap={sunTexture}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={1.5}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#fff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function OrbitRings() {
  const radii = [2.2, 3.0, 3.9, 4.9, 5.8, 6.8, 7.7];
  return (
    <group rotation={[0, 0, 0]}>
      {radii.map((r) => {
        const points = new THREE.EllipseCurve(
          0,
          0,
          r,
          r,
          0,
          Math.PI * 2,
          false,
          0
        )
          .getPoints(150)
          .map((p) => new THREE.Vector3(p.x, 0, p.y));
        return (
          <Line
            key={r}
            points={points}
            color="#6b7c99"
            lineWidth={0.8}
            transparent
            opacity={0.25}
          />
        );
      })}
    </group>
  );
}

const Planet = forwardRef<THREE.Group, PlanetProps>(function Planet(
  { cfg, onPick, paused = false },
  ref
) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const tex = TEXTURE_CONFIG[cfg.id];

  const albedoMap = useTexture(tex.albedo);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (groupRef.current && meshRef.current) {
        groupRef.current.userData.meshRef = meshRef.current;
        groupRef.current.userData.id = cfg.id;
        console.log(`Set up refs for planet: ${cfg.id}`);
      } else {
        console.warn(`Refs not ready for planet: ${cfg.id}`);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [cfg.id]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.3 * delta;
    }

    if (!paused && groupRef.current) {
      groupRef.current.rotation.y += cfg.orbitSpeed * delta;
    }
  });

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const pos = new THREE.Vector3();
    meshRef.current.getWorldPosition(pos);
    onPick(cfg.id, pos);
  }

  return (
    <group
      ref={(node: any) => {
        groupRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as any).current = node;
      }}
      rotation={[0, cfg.angle, 0]}
    >
      <group position={[cfg.radius, 0, 0]}>
        <mesh ref={meshRef} onClick={handleClick}>
          <sphereGeometry args={[cfg.size, 64, 64]} />
          <meshStandardMaterial
            map={albedoMap}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        <mesh scale={1.02}>
          <sphereGeometry args={[cfg.size, 32, 32]} />
          <meshBasicMaterial
            color={tex.color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>

        <Html
          center
          style={{ pointerEvents: "none" }}
          position={[0, cfg.size + 0.4, 0]}
        >
          <div className="text-white font-bold text-xs whitespace-nowrap drop-shadow-lg">
            {tex.label}
          </div>
        </Html>
      </group>
    </group>
  );
});

function framedLookAt(
  cam: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  ndcX = +0.35,
  ndcY = -0.25
) {
  const dir = new THREE.Vector3().subVectors(target, cam.position).normalize();
  const right = new THREE.Vector3().crossVectors(dir, cam.up).normalize();
  const up = new THREE.Vector3().crossVectors(right, dir).normalize();
  const dist = cam.position.distanceTo(target);
  const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov) * 0.5) * dist;
  const halfW = halfH * cam.aspect;

  const worldOffset = new THREE.Vector3()
    .addScaledVector(right, ndcX * halfW)
    .addScaledVector(up, ndcY * halfH);

  cam.lookAt(new THREE.Vector3().copy(target).add(worldOffset));
}

function getWorldRadius(mesh: THREE.Mesh) {
  const geo = mesh.geometry as THREE.BufferGeometry;
  if (!geo.boundingSphere) geo.computeBoundingSphere();
  const r = geo.boundingSphere?.radius ?? 1;

  const s = new THREE.Vector3();
  mesh.getWorldScale(s);
  return r * Math.max(s.x, s.y, s.z);
}

function distanceForFrame(
  radius: number,
  cam: THREE.PerspectiveCamera,
  fill = 0.6
) {
  const fovY = THREE.MathUtils.degToRad(cam.fov);
  const fovX = 2 * Math.atan(Math.tan(fovY / 2) * cam.aspect);

  const dY = radius / (fill * Math.tan(fovY / 2));
  const dX = radius / (fill * Math.tan(fovX / 2));
  return Math.max(dX, dY);
}

function CameraRig({
  mode,
  target,
  setMode,
  currentPlanetRef,
}: CameraRigProps) {
  const { camera } = useThree();
  const tempPos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const initialTarget = useRef<THREE.Vector3 | null>(null);
  const warpStartTime = useRef<number | null>(null);
  const hasSetPanelMode = useRef(false);

  useFrame((state, delta) => {
    const lerpSpeed = 1 - Math.pow(PERFORMANCE.CAMERA_LERP_SPEED, delta);

    if (mode === "warping-to") {
      if (warpStartTime.current === null) {
        warpStartTime.current = state.clock.elapsedTime;
        hasSetPanelMode.current = false;
        console.log("Started warping to target");
      }

      if (target && !initialTarget.current) {
        initialTarget.current = target.clone();
        console.log("Initial target set:", initialTarget.current);
      }

      if (initialTarget.current) {
        lookTarget.current.copy(initialTarget.current);
      } else {
        return;
      }

      const meshRef = currentPlanetRef?.current?.userData?.meshRef;
      let desiredPos: THREE.Vector3;

      if (meshRef) {
        meshRef.getWorldPosition(lookTarget.current);
        const r = getWorldRadius(meshRef);
        const dist = distanceForFrame(
          r,
          camera as THREE.PerspectiveCamera,
          0.58
        );

        const az = THREE.MathUtils.degToRad(35);
        const el = THREE.MathUtils.degToRad(18);
        const dir = new THREE.Vector3().setFromSpherical(
          new THREE.Spherical(1, Math.PI / 2 - el, az)
        );

        desiredPos = tempPos.current
          .copy(lookTarget.current)
          .addScaledVector(dir, dist + r * 0.15);
      } else {
        desiredPos = tempPos.current
          .copy(lookTarget.current)
          .add(new THREE.Vector3(1.2, 1, 2.5));
      }

      camera.position.lerp(desiredPos, lerpSpeed);
      framedLookAt(
        camera as THREE.PerspectiveCamera,
        lookTarget.current,
        +0.32,
        -0.18
      );

      const distance = camera.position.distanceTo(desiredPos);
      const elapsed = state.clock.elapsedTime - (warpStartTime.current ?? 0);

      if (!hasSetPanelMode.current && (distance < 0.08 || elapsed > 1.2)) {
        console.log(
          `Camera arrived! Distance: ${distance.toFixed(
            3
          )}, Elapsed: ${elapsed.toFixed(2)}s`
        );
        console.log("Switching to PANEL mode");
        initialTarget.current = null;
        warpStartTime.current = null;
        hasSetPanelMode.current = true;
        setMode("panel");
      }
    } else if (mode === "panel" && currentPlanetRef?.current) {
      warpStartTime.current = null;
      hasSetPanelMode.current = false;
      const meshRef = currentPlanetRef.current.userData?.meshRef;
      if (meshRef) {
        meshRef.getWorldPosition(lookTarget.current);
        const r = getWorldRadius(meshRef);
        const dist = distanceForFrame(
          r,
          camera as THREE.PerspectiveCamera,
          0.58
        );

        const az = THREE.MathUtils.degToRad(35);
        const el = THREE.MathUtils.degToRad(18);
        const dir = new THREE.Vector3().setFromSpherical(
          new THREE.Spherical(1, Math.PI / 2 - el, az)
        );

        const desiredPos = tempPos.current
          .copy(lookTarget.current)
          .addScaledVector(dir, dist + r * 0.15);

        camera.position.lerp(desiredPos, 0.03);
        framedLookAt(
          camera as THREE.PerspectiveCamera,
          lookTarget.current,
          +0.32,
          -0.18
        );
      }
    } else if (mode === "warping-back") {
      initialTarget.current = null;
      warpStartTime.current = null;
      hasSetPanelMode.current = false;
      const desiredPos = tempPos.current.set(0, 3, 11);
      camera.position.lerp(desiredPos, lerpSpeed);
      camera.lookAt(0, 0, 0);

      const distance = camera.position.distanceTo(desiredPos);
      if (distance < PERFORMANCE.CAMERA_POSITION_THRESHOLD) {
        setMode("hub");
      }
    } else {
      initialTarget.current = null;
      warpStartTime.current = null;
      hasSetPanelMode.current = false;
    }
  });

  return null;
}

function ShowcasePanel({ id, onBack }: { id: SectionId; onBack: () => void }) {
  console.log("ShowcasePanel rendering for:", id);

  const content = SECTION_CONTENT[id];
  const PanelComponent = PANEL_COMPONENTS[id];

  if (!content) {
    console.warn(`SECTION_CONTENT missing for id: ${id}`);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-end p-4 md:p-6">
      <div className="w-full md:w-[45%] max-w-lg pointer-events-auto">
        <div className="showcase-panel-content bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
          <PanelComponent content={content} onClose={onBack} />
        </div>
      </div>
    </div>
  );
}

function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const { progress } = useProgress();

  useEffect(() => {
    console.log("LoadingScreen progress:", progress);
    if (progress === 100 && onComplete) {
      console.log("Loading complete! Calling onComplete in 300ms...");
      const timer = setTimeout(() => {
        console.log("Calling onComplete now!");
        onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <Html center>
      <div className="flex flex-col items-center gap-6 text-white">
        <div className="relative">
          <img
            src="/textures/syslogo.svg"
            alt="SYSCO Logo"
            className="h-16 md:h-20 w-auto animate-pulse"
          />
        </div>
        <div className="flex flex-row items-center">
          <p className="text-lg md:text-xl font-semibold">Ачаалж байна...</p>
          {/* <div className="w-64 md:w-80 h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur-sm">
            <div
              className="h-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div> */}
        </div>
      </div>
    </Html>
  );
}

function WebGLNotSupported() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#060a18] text-white">
      <div className="max-w-md text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Дэмжигдэхгүй байна</h1>
        <p className="text-gray-400 mb-6">
          Таны хөтөч WebGL-г дэмжихгүй байна. Энэ хуудсыг үзэхийн тулд орчин
          үеийн хөтөч ашиглана уу.
        </p>
        <a
          href="https://get.webgl.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-semibold transition"
        >
          Дэлгэрэнгүй мэдээлэл
        </a>
      </div>
    </div>
  );
}

export default function GalaxyHero() {
  const [mode, setMode] = useState<Mode>("hub");
  const [current, setCurrent] = useState<SectionId | null>(null);
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isScrollingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);

  const planetRefsMap = useMemo(() => {
    return PLANET_CONFIGS.reduce((acc, p) => {
      acc[p.id as SectionId] = React.createRef<THREE.Group | null>();
      return acc;
    }, {} as Record<SectionId, React.RefObject<THREE.Group | null>>);
  }, []);

  useEffect(() => {
    console.log("isLoaded state changed to:", isLoaded);
  }, [isLoaded]);

  useEffect(() => {
    if (isLoading) {
      console.log("Setting timeout to check if Suspense triggers...");
      const timer = setTimeout(() => {
        console.log(
          "Timeout fired - Suspense never triggered, setting isLoaded to true"
        );
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
    useTexture.preload("/textures/8k_sun.jpg");
  }, []);

  useEffect(() => {
    console.log("State changed - Mode:", mode, "Current:", current);
  }, [mode, current]);

  useEffect(() => {
    console.log("Validating planet data...");
    console.log("ORDERED_SECTIONS:", ORDERED_SECTIONS);
    console.log("Total sections:", ORDERED_SECTIONS.length);

    PLANET_CONFIGS.forEach((planet) => {
      const hasContent = !!SECTION_CONTENT[planet.id];
      const hasTexture = !!TEXTURE_CONFIG[planet.id];
      const hasRef = !!planetRefsMap[planet.id];
      const status = hasContent && hasTexture && hasRef ? "OK" : "MISSING";
      console.log(
        `${status} ${planet.id}:`,
        `content=${hasContent ? "yes" : "no"}`,
        `texture=${hasTexture ? "yes" : "no"}`,
        `ref=${hasRef ? "yes" : "no"}`
      );
    });
  }, [planetRefsMap]);

  const onPick = React.useCallback((id: SectionId, worldPos: THREE.Vector3) => {
    console.log("Planet picked:", id);
    console.log("World position:", worldPos);
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
    setCurrentSection(0);
  }, []);

  const navigateToSection = React.useCallback(
    (index: number) => {
      console.log("navigateToSection called with index:", index);
      console.log("isScrollingRef.current:", isScrollingRef.current);
      console.log("Current mode:", mode);

      if (isScrollingRef.current && mode !== "panel") {
        console.log("Blocked - already scrolling");
        return;
      }

      if (mode === "panel") {
        isScrollingRef.current = false;
      }

      isScrollingRef.current = true;
      setCurrentSection(index);

      if (index >= 0 && index < ORDERED_SECTIONS.length) {
        const sectionId = ORDERED_SECTIONS[index];
        console.log("Target section ID:", sectionId);
        const planetRef = planetRefsMap[sectionId];

        if (planetRef?.current) {
          const meshRef = planetRef.current.userData?.meshRef;
          console.log("Mesh ref found:", !!meshRef);

          if (meshRef) {
            const pos = new THREE.Vector3();
            meshRef.getWorldPosition(pos);
            console.log("Position:", pos);
            onPick(sectionId, pos);
          } else {
            console.error("No meshRef for section:", sectionId);
          }
        } else {
          console.error("No planet ref for section:", sectionId);
        }
      }

      setTimeout(() => {
        isScrollingRef.current = false;
        console.log("Scroll lock released");
      }, 800);
    },
    [onPick, planetRefsMap, mode]
  );

  const onNavClick = React.useCallback(
    (id: SectionId) => {
      console.log("Nav clicked:", id, "| Mode:", mode, "| Current:", current);

      if (mode === "warping-to" || mode === "warping-back") {
        console.log("Currently warping - queuing navigation");
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
        console.log("Already viewing this planet, going back to hub");
        onBack();
        return;
      }

      requestAnimationFrame(() => {
        const planetRef = planetRefsMap[id];
        console.log(
          "Planet ref for",
          id,
          ":",
          planetRef?.current ? "found" : "missing"
        );

        if (planetRef?.current) {
          const meshRef = planetRef.current.userData?.meshRef;
          console.log("Mesh ref:", meshRef ? "found" : "missing");

          if (meshRef) {
            const pos = new THREE.Vector3();
            meshRef.getWorldPosition(pos);
            console.log("Navigating to position:", pos);
            onPick(id, pos);
            const sectionIndex = ORDERED_SECTIONS.indexOf(id);
            if (sectionIndex !== -1) {
              console.log("Setting current section to:", sectionIndex);
              setCurrentSection(sectionIndex);
            }
          } else {
            console.error("No meshRef found for planet:", id);
            console.log("Group userData:", planetRef.current.userData);
          }
        } else {
          console.error("No planet ref found for:", id);
          console.log("Available refs:", Object.keys(planetRefsMap));
        }
      });
    },
    [mode, current, onBack, onPick, planetRefsMap, setCurrentSection]
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
        navigateToSection(
          Math.min(currentSection + 1, ORDERED_SECTIONS.length - 1)
        );
      }
      if (e.key === "ArrowUp" && !isScrollingRef.current) {
        e.preventDefault();
        navigateToSection(Math.max(currentSection - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [mode, currentSection, onBack, navigateToSection]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      console.log("Wheel event - deltaY:", e.deltaY);
      console.log(
        "Current state - isScrolling:",
        isScrollingRef.current,
        "mode:",
        mode,
        "currentSection:",
        currentSection
      );

      if (
        isScrollingRef.current ||
        mode === "warping-to" ||
        mode === "warping-back"
      ) {
        console.log(
          "Scroll blocked - isScrolling:",
          isScrollingRef.current,
          "mode:",
          mode
        );
        return;
      }

      if (mode === "panel") {
        return;
      }

      if (Math.abs(e.deltaY) < PERFORMANCE.SCROLL_THRESHOLD) {
        console.log(
          "Scroll too small, threshold:",
          PERFORMANCE.SCROLL_THRESHOLD
        );
        return;
      }

      e.preventDefault();

      if (e.deltaY > 0 && currentSection < ORDERED_SECTIONS.length - 1) {
        console.log("Scrolling DOWN to section:", currentSection + 1);
        navigateToSection(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        console.log("Scrolling UP to section:", currentSection - 1);
        navigateToSection(currentSection - 1);
      } else {
        console.log(
          "At boundary - deltaY:",
          e.deltaY,
          "currentSection:",
          currentSection,
          "max:",
          ORDERED_SECTIONS.length - 1
        );
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection, mode, navigateToSection]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".showcase-panel-content")) {
        return;
      }

      touchStartYRef.current = e.touches[0].clientY;
      touchStartTimeRef.current = Date.now();
      console.log("Touch start - Y:", touchStartYRef.current);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".showcase-panel-content")) {
        return;
      }

      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".showcase-panel-content")) {
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
        console.log("Touch blocked - busy");
        touchStartYRef.current = null;
        touchStartTimeRef.current = null;
        return;
      }

      if (mode === "panel") {
        touchStartYRef.current = null;
        touchStartTimeRef.current = null;
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartYRef.current - touchEndY;
      const deltaTime = Date.now() - touchStartTimeRef.current;
      const velocity = Math.abs(deltaY) / deltaTime;

      console.log("Touch end - deltaY:", deltaY, "velocity:", velocity);

      const SWIPE_THRESHOLD = 50;
      const VELOCITY_THRESHOLD = 0.5;

      if (Math.abs(deltaY) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
        if (deltaY > 0 && currentSection < ORDERED_SECTIONS.length - 1) {
          console.log("Swipe UP - going to next planet");
          navigateToSection(currentSection + 1);
        } else if (deltaY < 0 && currentSection > 0) {
          console.log("Swipe DOWN - going to previous planet");
          navigateToSection(currentSection - 1);
        }
      }

      touchStartYRef.current = null;
      touchStartTimeRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSection, mode, navigateToSection]);

  if (!webglSupported) return <WebGLNotSupported />;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#060a18] text-white relative">
      <div className="absolute inset-0 -z-10">
        <img
          src="/textures/8k_stars_milky_way.jpg"
          alt="Milky Way stars background"
          className="w-full h-full object-cover "
          loading="eager"
          onError={(e) => {
            console.error("Failed to load background image");
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <Canvas
        camera={{ position: [0, 3, 11], fov: 50 }}
        dpr={[1, reducedMotion ? 1 : 1.5]}
        shadows={false}
        gl={{
          antialias: !reducedMotion,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <Suspense
          fallback={
            <LoadingScreen
              onComplete={() => {
                console.log("LoadingScreen onComplete called!");
                setIsLoaded(true);
                setIsLoading(false);
              }}
            />
          }
        >
          <ambientLight intensity={0.2} color="#b8d4ff" />
          <directionalLight
            position={[8, 5, 5]}
            intensity={1.5}
            color="#ffffff"
          />
          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.3}
            color="#4080ff"
          />
          <pointLight
            position={[0, 0, 0]}
            intensity={1.2}
            color="#ffcf6b"
            distance={15}
            decay={2}
          />
          <group>
            <Sun onClick={onBack} />
            <OrbitRings />
            {PLANET_CONFIGS.map((p) => (
              <Planet
                key={p.id}
                ref={planetRefsMap[p.id] as any}
                cfg={p}
                onPick={onPick}
                paused={mode !== "hub"}
              />
            ))}
          </group>
          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.2} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
          <CameraRig
            mode={mode}
            target={target}
            setMode={setMode}
            currentPlanetRef={(current ? planetRefsMap[current] : null) as any}
          />
        </Suspense>
      </Canvas>

      {mode === "panel" && current && (
        <ShowcasePanel id={current} onBack={onBack} />
      )}

      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-linear-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img
            src="/textures/syslogo.svg"
            alt="Logo"
            className="h-8 md:h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onBack}
          />
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide">
          {ORDERED_SECTIONS.map((id) => {
            const data = TEXTURE_CONFIG[id];
            const isActive = current === id;
            const isWarping = mode === "warping-to" || mode === "warping-back";
            return (
              <button
                key={id}
                onClick={() => onNavClick(id)}
                className={`px-2 md:px-3 py-1.5 md:py-2 rounded-full border transition-all duration-200 text-[10px] md:text-xs font-medium touch-manipulation whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-white/20 border-white/40"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                } ${
                  isWarping ? "opacity-60" : "cursor-pointer active:scale-95"
                }`}
                style={{
                  borderColor: isActive ? data.color : undefined,
                  boxShadow: isActive ? `0 0 16px ${data.color}40` : undefined,
                }}
              >
                {data.label}
              </button>
            );
          })}
        </div>
      </nav>

      {false && (
        <div className="absolute top-20 left-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>
            Mode: <span className="text-cyan-400">{mode}</span>
          </div>
          <div>
            Current:{" "}
            <span className="text-yellow-400">{current || "null"}</span>
          </div>
          <div>
            Target:{" "}
            <span className="text-green-400">{target ? "set" : "null"}</span>
          </div>
          <div>
            Section: <span className="text-purple-400">{currentSection}</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400">
            Panel should render: {mode === "panel" && current ? "YES" : "NO"}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <button
              onClick={() => {
                const planets = ORDERED_SECTIONS;
                let idx = 0;
                const testNext = () => {
                  if (idx >= planets.length) {
                    console.log("All planets tested!");
                    return;
                  }
                  const planetId = planets[idx];
                  console.log(
                    `\nTesting planet ${idx + 1}/${planets.length}: ${planetId}`
                  );
                  const ref = planetRefsMap[planetId];
                  if (ref?.current) {
                    const meshRef = ref.current.userData?.meshRef;
                    if (meshRef) {
                      const pos = new THREE.Vector3();
                      meshRef.getWorldPosition(pos);
                      onPick(planetId, pos);
                      idx++;
                      setTimeout(testNext, 3000);
                    }
                  }
                };
                testNext();
              }}
              className="w-full px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-[10px]"
            >
              Test All Planets
            </button>
          </div>
        </div>
      )}

      {isLoaded && (
        <div className="absolute bottom-4 left-4 md:hidden text-xs text-gray-400 bg-slate-900/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
          Swipe up/down or tap planets
        </div>
      )}

      {isLoaded && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3">
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
                      navigateToSection(index);
                    }
                  }}
                  className="relative flex flex-col items-center pointer-events-auto cursor-pointer group transition-transform hover:scale-110 active:scale-95"
                  disabled={
                    isScrollingRef.current ||
                    mode === "warping-to" ||
                    mode === "warping-back"
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
                      opacity: isPast ? 0.6 : isActive ? 1 : 0.3,
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
                <div className="text-white/50 text-[10px] mb-1">Swipe</div>
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
      )}
    </div>
  );
}
