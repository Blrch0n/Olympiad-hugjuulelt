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
  Stars,
  Line,
  Environment,
  Image as DreiImage,
  shaderMaterial,
  Billboard,
  useProgress,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { extend } from "@react-three/fiber";

/**
 * SOLAR WARP 3D — v2
 * - Fully 3D solar hub like your Figma (rings, sun, planets with textures & rim glow)
 * - Light‑speed warp camera + star tunnel
 * - Planet Showcase view: clicked planet fills the left side like your “Шагналын сан” frame
 * - Background nebula image plane + vignette
 *
 * ASSETS to add under /public (or /public/textures & /public/hdr):
 *  /textures/bg-space.webp                ← backdrop (1100×700+)
 *  /textures/planet_purple_albedo.webp    ← prizes look
 *  /textures/planet_blue_albedo.webp
 *  /textures/planet_teal_albedo.webp
 *  /textures/planet_orange_albedo.webp
 *  /textures/planet_green_albedo.webp
 *  /textures/planet_normal.webp           ← generic normal
 *  /textures/planet_rough.webp            ← generic roughness
 *  /textures/planet_streaks.png           ← transparent lightning streaks (emissive overlay)
 * (You can use any images; keep names, or edit TEX map below.)
 */

// ---------- Helpers ----------
function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// ---------- Fresnel Rim Shader ----------
const FresnelMat = shaderMaterial(
  { color: new THREE.Color(0x8ad8ff), power: 1.6, intensity: 0.7 },
  /* glsl */ `
  varying vec3 vN;
  varying vec3 vW;
  void main(){
    vN = normalize(normalMatrix * normal);
    vec4 wPos = modelMatrix * vec4(position,1.0);
    vW = normalize(cameraPosition - wPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * wPos;
  }`,
  /* glsl */ `
  uniform vec3 color; uniform float power; uniform float intensity;
  varying vec3 vN; varying vec3 vW;
  void main(){
    float fres = pow(1.0 - max(0.0, dot(normalize(vN), normalize(vW))), power);
    gl_FragColor = vec4(color, fres * intensity);
  }`
);
extend({ FresnelMat });

type SectionId =
  | "about"
  | "rules"
  | "prizes"
  | "sponsor"
  | "contact"
  | "register"
  | "faq";

type Mode = "hub" | "warping-to" | "panel" | "warping-back";

// Content for each section
const CONTENT: Record<
  SectionId,
  { title: string; description: string; details: string[] }
> = {
  about: {
    title: "Олимпиадын тухай",
    description:
      "Манай олимпиад нь залуу авьяаслаг хүмүүсийг нэгтгэн, мэдлэг чадвараа дэлгэрүүлэх боломжийг олгоно.",
    details: [
      "🎯 Улс хоорондын түвшний тэмцээн",
      "🏆 Жил бүр зохион байгуулагддаг",
      "🌟 1000+ оролцогч цуглуулдаг",
      "💡 Шинэ санаа, чадвараа харуулах боломж",
    ],
  },
  rules: {
    title: "Шалгалт",
    description:
      "Шалгалтын үе шат, дүрэм журам болон үнэлгээний шалгуурын талаар мэдээлэл.",
    details: [
      "📝 3 үе шаттай шалгалт",
      "⏰ Тус бүр 2 цагийн хугацаатай",
      "📊 Онлайн болон офлайн хэлбэртэй",
      "🎓 Мэргэжлийн шалгуур үзүүлэлтээр үнэлнэ",
    ],
  },
  prizes: {
    title: "Шагналын сан",
    description: "Тэргүүн байранд шалгарсан оролцогчдод өгөх урамшууллын сан.",
    details: [
      "🥇 1-р байр: ₮5,000,000",
      "🥈 2-р байр: ₮3,000,000",
      "🥉 3-р байр: ₮1,500,000",
      "🎁 Онцгой шагналууд болон хөтөлбөр",
    ],
  },
  sponsor: {
    title: "Ивээн тэтгэч",
    description: "Манай үйл ажиллагааг дэмжиж буй хамтрагч байгууллагууд.",
    details: [
      "🤝 10+ үндэсний компани",
      "🌐 Олон улсын түншүүд",
      "💼 Ажлын байрны боломж",
      "🎯 Ур чадварын хөгжлийн хөтөлбөр",
    ],
  },
  contact: {
    title: "Холбоо барих",
    description: "Бидэнтэй холбогдох, асуулт асуух боломжтой.",
    details: [
      "📧 Email: info@olympiad.mn",
      "📱 Утас: +976 7777-7777",
      "🏢 Хаяг: Улаанбаатар хот, СБД",
      "🕐 Ажлын цаг: Да-Ба 9:00-18:00",
    ],
  },
  register: {
    title: "Бүртгүүлэх",
    description: "Олимпиадад оролцохын тулд бүртгүүлэх шаардлагатай.",
    details: [
      "✅ Онлайн бүртгэл нээлттэй",
      "📅 Эхлэх: 2025 оны 11-р сар",
      "👥 Багаар болон ганцаарчилсан",
      "📄 Иргэний үнэмлэх шаардлагатай",
    ],
  },
  faq: {
    title: "Түгээмэл асуулт",
    description: "Олимпиадтай холбоотой түгээмэл асуудаг асуултууд.",
    details: [
      "❓ Хэн оролцох боломжтой вэ?",
      "❓ Бүртгэлийн хураамж хэд вэ?",
      "❓ Хэдэн үе шаттай вэ?",
      "❓ Онлайн оролцох боломжтой юу?",
    ],
  },
};

// ---------- Textures Map ----------
const TEX: Record<
  SectionId,
  {
    albedo: string;
    normal?: string;
    rough?: string;
    emissive?: string;
    label: string;
    color: string;
  }
> = {
  about: {
    albedo: "/textures/planet_green_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    label: "Олимпиадын тухай",
    color: "#10b981",
  },
  rules: {
    albedo: "/textures/planet_orange_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    label: "Шалгалт",
    color: "#f97316",
  },
  prizes: {
    albedo: "/textures/planet_purple_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    emissive: "/textures/planet_streaks.png",
    label: "Шагналын сан",
    color: "#a855f7",
  },
  sponsor: {
    albedo: "/textures/planet_blue_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    label: "Ивээн тэтгэч",
    color: "#3b82f6",
  },
  contact: {
    albedo: "/textures/planet_purple_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    label: "Холбоо барих",
    color: "#8b5cf6",
  },
  register: {
    albedo: "/textures/planet_teal_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    label: "Бүртгүүлэх",
    color: "#14b8a6",
  },
  faq: {
    albedo: "/textures/planet_blue_albedo.webp",
    normal: "/textures/planet_normal.webp",
    rough: "/textures/planet_rough.webp",
    label: "Асуулт",
    color: "#06b6d4",
  },
};

interface PlanetCfg {
  id: SectionId;
  radius: number;
  size: number;
  angle: number;
  orbitSpeed: number;
}

// Positions with proper spacing to prevent overlap
const PLANETS: PlanetCfg[] = [
  { id: "about", radius: 2.2, size: 0.35, angle: 0, orbitSpeed: 0.08 },
  { id: "rules", radius: 3.0, size: 0.38, angle: 1.2, orbitSpeed: 0.06 },
  { id: "prizes", radius: 3.9, size: 0.42, angle: 2.5, orbitSpeed: 0.045 },
  { id: "sponsor", radius: 4.9, size: 0.4, angle: 3.8, orbitSpeed: 0.035 },
  { id: "contact", radius: 5.8, size: 0.36, angle: 5.0, orbitSpeed: 0.028 },
  { id: "register", radius: 6.8, size: 0.39, angle: 0.8, orbitSpeed: 0.022 },
  { id: "faq", radius: 7.7, size: 0.37, angle: 2.2, orbitSpeed: 0.018 },
];

// ---------- Star Tunnel (points drift -> warp) ----------
function StarTunnel({ mode }: { mode: Mode }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, speeds } = useMemo(() => {
    const N = 2500; // Reduced from 4500 for better performance
    const pos = new Float32Array(N * 3);
    const spd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = 40 * Math.cbrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      spd[i] = 0.04 + Math.random() * 0.06;
    }
    return { positions: pos, speeds: spd };
  }, []);
  useFrame((_, dt) => {
    const p = ref.current;
    const a = p.geometry.attributes.position as THREE.BufferAttribute;
    const warp = mode === "warping-to" || mode === "warping-back";
    for (let i = 0; i < a.count; i++) {
      const ix = i * 3;
      let x = a.array[ix] as number,
        y = a.array[ix + 1] as number,
        z = a.array[ix + 2] as number;
      if (warp) {
        const v = new THREE.Vector3(x, y, z).addScaledVector(
          new THREE.Vector3(x, y, z).normalize(),
          speeds[i] * 220 * dt
        );
        x = v.x;
        y = v.y;
        z = v.z;
        if (v.length() > 120) {
          x = (Math.random() - 0.5) * 10;
          y = (Math.random() - 0.5) * 10;
          z = (Math.random() - 0.5) * 10;
        }
      } else {
        x -= speeds[i] * 4 * dt;
        if (x < -60) x = 60;
      }
      a.array[ix] = x;
      a.array[ix + 1] = y;
      a.array[ix + 2] = z;
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.9}
        color="#cfe8ff"
      />
    </points>
  );
}

// ---------- Sun ----------
function Sun() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.12;
  });

  return (
    <group>
      {/* Core sun - clean, no rays */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.7, 64, 64]} />
        <meshStandardMaterial
          emissive="#ff8800"
          emissiveIntensity={2.5}
          color="#ffbb44"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Subtle inner glow only */}
      <mesh scale={1.15}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color="#ff9933"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ---------- Planet (textured) ----------
const Planet = forwardRef<
  THREE.Group,
  {
    cfg: PlanetCfg;
    onPick: (id: SectionId, worldPos: THREE.Vector3) => void;
    paused?: boolean;
  }
>(function Planet({ cfg, onPick, paused = false }, ref) {
  const g = useRef<THREE.Group>(null!);
  const m = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const tex = TEX[cfg.id];
  const loader = useMemo(() => new THREE.TextureLoader(), []);

  // Optimized texture loading with error handling - disabled for now
  const albedo = useMemo(() => {
    // Textures are optional - using solid colors instead
    return null;
  }, [tex.albedo, loader, cfg.id]);

  const normal = useMemo(() => {
    // Normal maps are optional
    return undefined;
  }, [tex.normal, loader, cfg.id]);

  const rough = useMemo(() => {
    // Roughness maps are optional
    return undefined;
  }, [tex.rough, loader, cfg.id]);

  const emissive = useMemo(() => {
    // Emissive maps are optional
    return undefined;
  }, [tex.emissive, loader, cfg.id]);

  useFrame((_, dt) => {
    // Orbit around sun (rotate the parent group) - only if not paused
    if (!paused) {
      g.current.rotation.y += cfg.orbitSpeed * dt;
    }

    // Planet self-rotation (always rotate for realism)
    m.current.rotation.y += 0.3 * dt;
    m.current.rotation.x = 0.1; // Slight axial tilt for realism

    // Cloud layer rotation (slightly faster)
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.35 * dt;
    }

    // Pulse effect on hover
    if (hovered) {
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
      m.current.scale.setScalar(scale);
    } else {
      m.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  function click(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const p = new THREE.Vector3();
    m.current.getWorldPosition(p);
    onPick(cfg.id, p);
  }

  function onPointerOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }

  function onPointerOut() {
    setHovered(false);
    document.body.style.cursor = "default";
  }

  return (
    <group rotation={[0, cfg.angle, 0]}>
      <group
        ref={(node: any) => {
          g.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        position={[cfg.radius, 0, 0]}
      >
        {/* Main planet body */}
        <mesh
          ref={m}
          onClick={click}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[cfg.size, 128, 128]} />
          <meshStandardMaterial
            map={albedo || undefined}
            normalMap={normal}
            normalScale={new THREE.Vector2(1.5, 1.5)}
            roughnessMap={rough}
            roughness={0.95}
            metalness={0.02}
            color={albedo ? undefined : tex.color}
            envMapIntensity={0.4}
            bumpScale={0.05}
          />
        </mesh>

        {/* Cloud/Weather layer for Earth-like appearance */}
        <mesh ref={cloudsRef} scale={1.01}>
          <sphereGeometry args={[cfg.size, 64, 64]} />
          <meshStandardMaterial
            transparent
            opacity={0.15}
            color="#ffffff"
            roughness={1}
            metalness={0}
            depthWrite={false}
          />
        </mesh>

        {/* Atmospheric glow layer (thicker for realism) */}
        <mesh scale={1.12}>
          <sphereGeometry args={[cfg.size, 32, 32]} />
          <meshBasicMaterial
            color={tex.color}
            transparent
            opacity={hovered ? 0.2 : 0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* emissive streak shell */}
        {emissive && (
          <mesh scale={1.02}>
            <sphereGeometry args={[cfg.size, 64, 64]} />
            <meshBasicMaterial
              map={emissive}
              transparent
              opacity={0.9}
              color={new THREE.Color(0xffffff)}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Enhanced rim fresnel for atmospheric scattering */}
        <mesh scale={hovered ? 1.15 : 1.13}>
          <sphereGeometry args={[cfg.size, 48, 48]} />
          {/* @ts-ignore */}
          <fresnelMat
            transparent
            depthWrite={false}
            power={2.5}
            intensity={hovered ? 1.8 : 1.3}
            color={new THREE.Color(hovered ? tex.color : "#8ad8ff")}
          />
        </mesh>

        {/* Specular ocean/ice reflection */}
        <mesh
          position={[cfg.size * 0.35, cfg.size * 0.35, cfg.size * 0.35]}
          scale={0.18}
        >
          <sphereGeometry args={[cfg.size, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* world-space label */}
        <Html
          center
          style={{ pointerEvents: "none", userSelect: "none" }}
          position={[0, cfg.size + 0.3, 0]}
        >
          <div
            className={`text-white font-bold text-xs drop-shadow-[0_0_8px_rgba(255,255,255,.55)] whitespace-nowrap transition-all duration-300 ${
              hovered ? "scale-110" : "scale-100"
            }`}
          >
            {TEX[cfg.id].label}
          </div>
        </Html>
      </group>
    </group>
  );
});

// ---------- Orbit Rings ----------
function OrbitRings() {
  const radii = [2.2, 3.0, 3.9, 4.9, 5.8, 6.8, 7.7];
  return (
    <group rotation={[0, 0, 0]}>
      {radii.map((r) => {
        const pts = new THREE.EllipseCurve(0, 0, r, r)
          .getPoints(200)
          .map((p) => new THREE.Vector3(p.x, 0, p.y));
        return (
          <Line
            key={r}
            points={pts}
            color="#6b7c99"
            linewidth={0.8}
            transparent
            opacity={0.25}
          />
        );
      })}
    </group>
  );
}

// ---------- Camera Rig ----------
function CameraRig({
  mode,
  target,
  setMode,
  currentPlanetRef,
}: {
  mode: Mode;
  target: THREE.Vector3 | null;
  setMode: (m: Mode) => void;
  currentPlanetRef: React.RefObject<THREE.Group | null> | null | undefined;
}) {
  const { camera } = useThree();
  const tmp = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    if (mode === "warping-to" && target) {
      // Position camera to show planet on LEFT side of screen (offset to right)
      const offset = new THREE.Vector3(2.2, 0, 3.0);
      const desired = tmp.current.copy(target).add(offset);
      camera.position.lerp(desired, 1 - Math.pow(0.00001, dt));
      camera.lookAt(target);
      if (camera.position.distanceTo(desired) < 0.015) setMode("panel");
    } else if (mode === "panel" && currentPlanetRef?.current) {
      // Keep planet on LEFT side consistently
      currentPlanetRef.current.getWorldPosition(lookTarget.current);
      const offset = new THREE.Vector3(2.2, 0, 3.0);
      const desired = tmp.current.copy(lookTarget.current).add(offset);
      camera.position.lerp(desired, 0.08);
      camera.lookAt(lookTarget.current);
    } else if (mode === "warping-back") {
      const desired = tmp.current.set(0, 3, 12);
      camera.position.lerp(desired, 1 - Math.pow(0.00001, dt));
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(desired) < 0.015) setMode("hub");
    }
  });
  return null;
}

// ---------- Panel Showcase (fixed overlay layout) ----------
function Showcase({
  id,
  onBack,
}: {
  id: SectionId;
  onBack: () => void;
  planetRef?: React.RefObject<THREE.Group | null> | null | undefined;
}) {
  const content = CONTENT[id];
  const tex = TEX[id];

  return (
    <Html fullscreen>
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-end pr-4 md:pr-12">
        {/* Right side - content panel only */}
        <div className="w-full max-w-xl md:max-w-2xl pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl animate-slideInRight">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 animate-fadeIn"
              style={{
                textShadow: `0 0 24px ${tex.color}66, 0 0 40px ${tex.color}33`,
                color: tex.color,
              }}
            >
              {content.title}
            </h1>
            <p
              className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed animate-fadeIn"
              style={{ animationDelay: "100ms" }}
            >
              {content.description}
            </p>
            <ul className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {content.details.map((detail, idx) => (
                <li
                  key={idx}
                  className="text-gray-200 text-sm md:text-base flex items-start gap-3 animate-fadeIn"
                  style={{ animationDelay: `${idx * 80 + 200}ms` }}
                >
                  <span className="shrink-0">{detail}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onBack}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-95 text-white font-bold px-6 py-3 md:py-4 transition-all duration-300 shadow-[0_0_24px_rgba(60,220,255,.6)] hover:shadow-[0_0_36px_rgba(60,220,255,.9)]"
            >
              <span>←</span>
              <span>Буцах</span>
            </button>
          </div>
        </div>
      </div>
    </Html>
  );
}

// ---------- Loading Screen ----------
function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm font-semibold">
          {progress.toFixed(0)}% уншиж байна...
        </p>
      </div>
    </Html>
  );
}

// ---------- Instructions Overlay ----------
function Instructions({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 animate-fadeIn pointer-events-none">
      <p className="text-white text-sm font-medium flex items-center gap-2">
        <span className="text-2xl">🖱️</span>
        <span>Гаригууд дээр дарж мэдээлэл үзнэ үү</span>
      </p>
    </div>
  );
}

// ---------- WebGL Support Check ----------
function WebGLNotSupported() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#060a18] text-white">
      <div className="max-w-md text-center p-8">
        <h1 className="text-3xl font-bold mb-4">⚠️ Дэмжигдэхгүй байна</h1>
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

// ---------- Main ----------
export default function SolarWarp3D() {
  const [mode, setMode] = useState<Mode>("hub");
  const [current, setCurrent] = useState<SectionId | null>(null);
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const isScrollingRef = useRef(false);

  // Ordered list of sections for scroll navigation
  const orderedSections: SectionId[] = [
    "about",
    "rules",
    "prizes",
    "sponsor",
    "contact",
    "register",
    "faq",
  ];

  // Store references to planets
  const planetRefsMap = useMemo(() => {
    const refs: { [key in SectionId]?: React.RefObject<THREE.Group | null> } =
      {};
    orderedSections.forEach((id) => {
      refs[id] = React.createRef<THREE.Group>();
    });
    return refs;
  }, []);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebglSupported(false);
    }

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    // Hide instructions after 5 seconds
    const timer = setTimeout(() => setShowInstructions(false), 5000);

    // Keyboard navigation
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode === "panel") {
        onBack();
      }
      // Arrow key navigation
      if (e.key === "ArrowDown" && !isScrollingRef.current) {
        e.preventDefault();
        navigateToSection(Math.min(currentSection + 1, orderedSections.length));
      }
      if (e.key === "ArrowUp" && !isScrollingRef.current) {
        e.preventDefault();
        navigateToSection(Math.max(currentSection - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [mode, currentSection]);

  // Scroll handler with debounce
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current || mode === "panel") return;

      const scrollThreshold = 50; // Minimum scroll amount to trigger
      if (Math.abs(e.deltaY) < scrollThreshold) return;

      e.preventDefault();

      if (e.deltaY > 0 && currentSection < orderedSections.length - 1) {
        // Scroll down to next planet
        navigateToSection(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        // Scroll up to previous planet
        navigateToSection(currentSection - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSection, mode, orderedSections.length]);

  function navigateToSection(index: number) {
    if (isScrollingRef.current) return;

    isScrollingRef.current = true;
    setCurrentSection(index);

    if (index >= 0 && index < orderedSections.length) {
      // Navigate to planet using its ref for accurate position
      const sectionId = orderedSections[index];
      const planetRef = planetRefsMap[sectionId];

      if (planetRef?.current) {
        const worldPos = new THREE.Vector3();
        planetRef.current.getWorldPosition(worldPos);
        onPick(sectionId, worldPos);
      }
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 2000);
  }

  function onPick(id: SectionId, worldPos: THREE.Vector3) {
    setCurrent(id);
    setTarget(worldPos);
    setMode("warping-to");
    setShowInstructions(false);
  }

  function onBack() {
    setMode("warping-back");
    setTimeout(() => {
      setCurrent(null);
      setTarget(null);
    }, 500);
  }

  function onNavClick(id: SectionId) {
    if (mode !== "hub" && mode !== "panel") return;

    // If already viewing this planet, go back to hub
    if (current === id && mode === "panel") {
      onBack();
      return;
    }

    // Get planet position from ref for accurate world position
    const planetRef = planetRefsMap[id];
    if (planetRef?.current) {
      const worldPos = new THREE.Vector3();
      planetRef.current.getWorldPosition(worldPos);
      onPick(id, worldPos);

      // Update current section for progress indicator
      const sectionIndex = orderedSections.indexOf(id);
      if (sectionIndex !== -1) {
        setCurrentSection(sectionIndex);
      }
    }
  }

  if (!webglSupported) {
    return <WebGLNotSupported />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#060a18] text-white relative">
      {/* Backdrop Image - using gradient instead of texture */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#060a18] via-[#0a1128] to-[#060a18]">
        {/* Optional: Add texture when available */}
        {/* <img
          src="/textures/bg-space.webp"
          alt="Space background"
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        /> */}
      </div>

      <Canvas
        camera={{ position: [0, 3, 12], fov: 50 }}
        dpr={[1, reducedMotion ? 1 : 1.5]}
        shadows={false}
        gl={{
          antialias: !reducedMotion,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={<LoadingScreen />}>
          {/* Improved lighting setup for realistic planets */}
          <ambientLight intensity={0.2} color="#b8d4ff" />
          <directionalLight
            position={[8, 5, 5]}
            intensity={1.5}
            color="#ffffff"
            castShadow={false}
          />
          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.3}
            color="#4080ff"
            castShadow={false}
          />
          <pointLight
            position={[0, 0, 0]}
            intensity={1.2}
            color="#ffcf6b"
            distance={15}
            decay={2}
          />

          {/* center system */}
          <group>
            <Sun />
            <OrbitRings />
            {PLANETS.map((p) => (
              <Planet
                key={p.id}
                ref={planetRefsMap[p.id] as any}
                cfg={p}
                onPick={onPick}
                paused={
                  mode === "warping-to" ||
                  mode === "panel" ||
                  mode === "warping-back"
                }
              />
            ))}
          </group>

          {/* Starfield / Warp */}
          {!reducedMotion && <StarTunnel mode={mode} />}

          {/* Background vignette & glow */}
          {!reducedMotion && (
            <EffectComposer>
              <Bloom
                intensity={0.65}
                luminanceThreshold={0.18}
                luminanceSmoothing={0.9}
              />
              <ChromaticAberration
                offset={
                  mode === "warping-to" || mode === "warping-back"
                    ? new THREE.Vector2(0.002, 0.002)
                    : new THREE.Vector2(0.0005, 0.0005)
                }
                blendFunction={BlendFunction.NORMAL}
              />
              <Noise premultiply opacity={mode === "hub" ? 0.03 : 0.06} />
              <Vignette eskil={false} offset={0.2} darkness={0.85} />
            </EffectComposer>
          )}

          {/* Camera rig to animate */}
          <CameraRig
            mode={mode}
            target={target}
            setMode={setMode}
            currentPlanetRef={(current ? planetRefsMap[current] : null) as any}
          />

          {/* When in panel mode, render the big planet showcase */}
          {mode === "panel" && current && (
            <Showcase id={current} onBack={onBack} />
          )}
        </Suspense>
      </Canvas>

      {/* Top-right navbar - Fully functional with all planets */}
      <nav className="absolute right-6 top-5 flex flex-wrap gap-2 text-sm z-10 max-w-md">
        {orderedSections.map((id) => {
          const data = TEX[id];
          const isActive = current === id;
          return (
            <button
              key={id}
              onClick={() => onNavClick(id)}
              disabled={mode === "warping-to" || mode === "warping-back"}
              className={`px-3 py-2 rounded-full border transition-all duration-200 text-xs font-medium ${
                isActive
                  ? "bg-white/20 border-white/40 shadow-[0_0_16px_rgba(255,255,255,.4)]"
                  : "bg-white/5 border-white/10 shadow-[0_0_10px_rgba(0,0,0,.4)] hover:bg-white/10 hover:border-white/20"
              } ${
                mode === "warping-to" || mode === "warping-back"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer active:scale-95"
              }`}
              style={{
                borderColor: isActive ? data.color : undefined,
                boxShadow: isActive ? `0 0 16px ${data.color}40` : undefined,
              }}
              aria-label={`Үзэх: ${data.label}`}
            >
              {data.label}
            </button>
          );
        })}
      </nav>

      {/* Instructions overlay */}
      <Instructions show={showInstructions && mode === "hub"} />

      {/* Mobile helper text */}
      <div className="absolute bottom-4 left-4 md:hidden text-xs text-gray-400 bg-slate-900/50 px-3 py-2 rounded-lg">
        📱 Гараар зөөх: Гарагууд дээр товшино уу
      </div>

      {/* Scroll indicator with planet progress */}
      {mode === "hub" && currentSection < orderedSections.length - 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
          {/* Planet progress dots */}
          <div className="flex items-center gap-2 bg-slate-900/70 px-4 py-3 rounded-full backdrop-blur-sm">
            {orderedSections.map((section, index) => {
              const planet = TEX[section as keyof typeof TEX];
              const isActive = index === currentSection;
              const isPast = index < currentSection;

              return (
                <div
                  key={section}
                  className="relative flex flex-col items-center"
                >
                  {/* Planet dot */}
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-4 h-4 ring-2 ring-white/50 ring-offset-2 ring-offset-slate-900/50"
                        : "w-2.5 h-2.5"
                    }`}
                    style={{
                      backgroundColor: planet.color,
                      opacity: isPast ? 0.6 : isActive ? 1 : 0.3,
                      boxShadow: isActive
                        ? `0 0 12px ${planet.color}, 0 0 24px ${planet.color}40`
                        : "none",
                    }}
                  />

                  {/* Active planet label */}
                  {isActive && (
                    <div
                      className="absolute -bottom-6 text-xs font-medium whitespace-nowrap"
                      style={{ color: planet.color }}
                    >
                      {planet.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scroll hint with bounce animation */}
          <div className="flex flex-col items-center animate-bounce mt-2">
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
        </div>
      )}

      {/* CSS Animations for smooth transitions */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
