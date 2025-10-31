import { SectionId, PlanetConfig, TextureConfig } from "./galaxy-types";

export const TEXTURE_CONFIG: Record<SectionId, TextureConfig> = {
  about: {
    albedo: "/textures/8k_earth_daymap.webp",
    label: "Олимпиадын тухай",
    color: "#10b981",
  },
  rules: {
    albedo: "/textures/8k_mars.webp",
    label: "Шалгалт",
    color: "#f97316",
  },
  prizes: {
    albedo: "/textures/8k_jupiter.webp",
    label: "Шагналын сан",
    color: "#a855f7",
  },
  sponsor: {
    albedo: "/textures/8k_saturn.webp",
    label: "Ивээн тэтгэч",
    color: "#3b82f6",
  },
  contact: {
    albedo: "/textures/8k_mercury.webp",
    label: "Холбоо барих",
    color: "#8b5cf6",
  },
  register: {
    albedo: "/textures/8k_venus_surface.webp",
    label: "Бүртгүүлэх",
    color: "#14b8a6",
  },
  faq: {
    albedo: "/textures/2k_uranus.webp",
    label: "Асуулт",
    color: "#06b6d4",
  },
};

export const PLANET_CONFIGS: PlanetConfig[] = [
  { id: "about", radius: 2.2, size: 0.6, angle: 0, orbitSpeed: 0.1 },
  { id: "rules", radius: 3.0, size: 0.6, angle: 1.2, orbitSpeed: 0.1 },
  { id: "prizes", radius: 3.9, size: 0.6, angle: 2.5, orbitSpeed: 0.1 },
  { id: "sponsor", radius: 4.9, size: 0.6, angle: 3.8, orbitSpeed: 0.1 },
  { id: "contact", radius: 5.8, size: 0.6, angle: 5.0, orbitSpeed: 0.1 },
  { id: "register", radius: 6.8, size: 0.6, angle: 0.8, orbitSpeed: 0.1 },
  { id: "faq", radius: 7.7, size: 0.6, angle: 2.2, orbitSpeed: 0.1 },
];

export const ORDERED_SECTIONS: SectionId[] = [
  "about",
  "rules",
  "prizes",
  "sponsor",
  "contact",
  "register",
  "faq",
];

export const PERFORMANCE = {
  STAR_COUNT: 2000,
  CAMERA_LERP_SPEED: 0.00003,
  WARP_SPEED_MULTIPLIER: 220,
  STAR_RESET_DISTANCE: 120,
  CAMERA_POSITION_THRESHOLD: 0.02,
  SCROLL_DEBOUNCE: 2000,
  SCROLL_THRESHOLD: 50,
  INSTRUCTIONS_TIMEOUT: 5000,
} as const;
