"use client";

import React, { useMemo, useRef, forwardRef, Suspense } from "react";
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
} from "@/app/lib/galaxy-types";
import {
  TEXTURE_CONFIG,
  PLANET_CONFIGS,
  PERFORMANCE,
} from "@/app/lib/galaxy-constants";

function Sun({ onClick }: { onClick?: () => void }) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const sunTexture = useTexture("/textures/8k_sun.webp");
  const opacityRef = useRef(0);
  const scaleRef = useRef(0.3);
  const targetOpacity = useRef(0);
  const targetScale = useRef(0.3);

  const haloMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        innerColor: { value: new THREE.Color(0xffdc8c) },
        outerColor: { value: new THREE.Color(0xff8c3c) },
        opacity: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        uniform float opacity;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          float dist = length(vPosition);
          float falloff1 = smoothstep(0.0, 1.0, dist);
          float falloff2 = pow(dist, 1.5);
          float falloff = mix(falloff1, falloff2, 0.5);
          vec3 color = mix(innerColor, outerColor, falloff);
          float alpha = exp(-dist * 2.5) * 0.7;
          alpha = mix(alpha, 0.0, pow(falloff, 3.0));
          gl_FragColor = vec4(color, alpha * opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      targetOpacity.current = 1;
      targetScale.current = 1;
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.05;

    const lerpFactor = 1 - Math.pow(0.001, delta);
    opacityRef.current +=
      (targetOpacity.current - opacityRef.current) * lerpFactor;
    scaleRef.current += (targetScale.current - scaleRef.current) * lerpFactor;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current);
    }

    if (coreRef.current.material) {
      (coreRef.current.material as THREE.MeshStandardMaterial).opacity =
        opacityRef.current;
    }

    if (haloMaterial.uniforms.opacity) {
      haloMaterial.uniforms.opacity.value = opacityRef.current;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      <mesh scale={1.3} ref={coreRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#ffaa00"
          emissiveIntensity={1.5}
          emissiveMap={sunTexture}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh scale={1.5}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <primitive object={haloMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function OrbitRings({ visible }: { visible: boolean }) {
  const radii = [2.2, 3.0, 3.9, 4.9, 5.8, 6.8, 7.7];
  const [opacity, setOpacity] = React.useState(0);
  const opacityRef = useRef(0);
  const targetOpacity = useRef(0);
  const ringsRef = useRef<THREE.Group>(null!);

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        targetOpacity.current = visible ? 0.35 : 0;
      },
      visible ? 300 : 0
    );
    return () => clearTimeout(timer);
  }, [visible]);

  useFrame((_, delta) => {
    const lerpFactor = 1 - Math.pow(0.001, delta);
    opacityRef.current +=
      (targetOpacity.current - opacityRef.current) * lerpFactor;
    setOpacity(opacityRef.current);

    if (ringsRef.current) {
      ringsRef.current.children.forEach((child) => {
        if (child instanceof THREE.Line && child.material) {
          (child.material as THREE.LineBasicMaterial).opacity =
            opacityRef.current;
        }
      });
    }
  });

  return (
    <group ref={ringsRef} rotation={[0, 0, 0]}>
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
            lineWidth={1.0}
            transparent
            opacity={opacity}
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
  const innerGroupRef = useRef<THREE.Group>(null!);
  const tex = TEXTURE_CONFIG[cfg.id];
  const opacityRef = useRef(0);
  const scaleRef = useRef(0.3);
  const targetOpacity = useRef(0);
  const targetScale = useRef(0.3);
  const [labelOpacity, setLabelOpacity] = React.useState(0);

  const albedoMap = useTexture(tex.albedo);

  React.useEffect(() => {
    if (groupRef.current && meshRef.current) {
      groupRef.current.userData.meshRef = meshRef.current;
      groupRef.current.userData.id = cfg.id;
    }
  }, [cfg.id]);

  React.useEffect(() => {
    const planetIndex = PLANET_CONFIGS.findIndex((p) => p.id === cfg.id);
    const delay = 500 + planetIndex * 200;

    const timer = setTimeout(() => {
      targetOpacity.current = 1;
      targetScale.current = 1;
    }, delay);

    return () => clearTimeout(timer);
  }, [cfg.id]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.3 * delta;
    }

    if (!paused && groupRef.current) {
      groupRef.current.rotation.y += cfg.orbitSpeed * delta;
    }

    const lerpFactor = 1 - Math.pow(0.001, delta);
    opacityRef.current +=
      (targetOpacity.current - opacityRef.current) * lerpFactor;
    scaleRef.current += (targetScale.current - scaleRef.current) * lerpFactor;

    if (innerGroupRef.current) {
      innerGroupRef.current.scale.setScalar(scaleRef.current);
    }

    if (meshRef.current.material) {
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
        opacityRef.current;
    }

    setLabelOpacity(opacityRef.current);
  });

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const pos = new THREE.Vector3();
    meshRef.current.getWorldPosition(pos);
    onPick(cfg.id, pos);
  }

  return (
    <group
      ref={(node: THREE.Group | null) => {
        if (node) groupRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref && node) ref.current = node;
      }}
      rotation={[0, cfg.angle, 0]}
    >
      <group ref={innerGroupRef} position={[cfg.radius, 0, 0]}>
        <mesh ref={meshRef} onClick={handleClick}>
          <sphereGeometry args={[cfg.size, 64, 64]} />
          <meshStandardMaterial
            map={albedoMap}
            roughness={0.8}
            metalness={0.1}
            transparent
          />
        </mesh>

        <mesh scale={1.02}>
          <sphereGeometry args={[cfg.size, 32, 32]} />
          <meshBasicMaterial
            color={tex.color}
            transparent
            opacity={0.1 * opacityRef.current}
            side={THREE.BackSide}
          />
        </mesh>

        <Html
          center
          style={{ pointerEvents: "none", opacity: labelOpacity }}
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
      }

      if (target && !initialTarget.current) {
        initialTarget.current = target.clone();
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

function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const { progress } = useProgress();

  React.useEffect(() => {
    if (progress === 100 && onComplete) {
      const timer = setTimeout(() => {
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
        </div>
      </div>
    </Html>
  );
}

interface GalaxySceneProps {
  mode: Mode;
  target: THREE.Vector3 | null;
  setMode: (m: Mode) => void;
  currentPlanetRef: React.RefObject<THREE.Group | null> | null | undefined;
  onPick: (id: SectionId, worldPos: THREE.Vector3) => void;
  onBack: () => void;
  planetRefsMap: Record<SectionId, React.RefObject<THREE.Group | null>>;
  reducedMotion: boolean;
  onLoadingComplete: () => void;
}

export default function GalaxyScene({
  mode,
  target,
  setMode,
  currentPlanetRef,
  onPick,
  onBack,
  planetRefsMap,
  reducedMotion,
  onLoadingComplete,
}: GalaxySceneProps) {
  return (
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
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      frameloop="always"
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={<LoadingScreen onComplete={onLoadingComplete} />}>
        <ambientLight intensity={0.3} color="#b8d4ff" />

        <pointLight
          position={[0, 0, 0]}
          intensity={10}
          color="#ffcf6b"
          distance={30}
          decay={1.5}
        />

        <pointLight
          position={[0, 0, 0]}
          intensity={10}
          color="#ffa940"
          distance={35}
          decay={1.3}
        />

        <group>
          <Sun onClick={onBack} />
          <OrbitRings visible={mode === "hub"} />
          {PLANET_CONFIGS.map((p) => (
            <Planet
              key={p.id}
              ref={planetRefsMap[p.id]}
              cfg={p}
              onPick={onPick}
              paused={mode !== "hub"}
            />
          ))}
        </group>
        <EffectComposer autoClear={false}>
          <Bloom intensity={0.5} luminanceThreshold={0.2} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
        <CameraRig
          mode={mode}
          target={target}
          setMode={setMode}
          currentPlanetRef={currentPlanetRef}
        />
      </Suspense>
    </Canvas>
  );
}
