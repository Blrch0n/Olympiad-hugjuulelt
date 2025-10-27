import * as THREE from "three";

export type SectionId =
  | "about"
  | "rules"
  | "prizes"
  | "sponsor"
  | "contact"
  | "register"
  | "faq";

export type Mode = "hub" | "warping-to" | "panel" | "warping-back";

export interface PlanetConfig {
  id: SectionId;
  radius: number;
  size: number;
  angle: number;
  orbitSpeed: number;
}

export interface SectionContent {
  title: string;
  description: string;
  details: string[];
}

export interface TextureConfig {
  albedo: string;
  normal?: string;
  rough?: string;
  emissive?: string;
  label: string;
  color: string;
}

export interface PlanetProps {
  cfg: PlanetConfig;
  onPick: (id: SectionId, worldPos: THREE.Vector3) => void;
  paused?: boolean;
}

export interface CameraRigProps {
  mode: Mode;
  target: THREE.Vector3 | null;
  setMode: (m: Mode) => void;
  currentPlanetRef: React.RefObject<THREE.Group | null> | null | undefined;
}

export interface ShowcaseProps {
  id: SectionId;
  onBack: () => void;
  planetRef: React.RefObject<THREE.Group | null> | null | undefined;
}
