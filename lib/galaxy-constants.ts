import {
  SectionId,
  PlanetConfig,
  SectionContent,
  TextureConfig,
} from "./galaxy-types";

// Content for each section
export const SECTION_CONTENT: Record<SectionId, SectionContent> = {
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

// Texture configurations for each planet
export const TEXTURE_CONFIG: Record<SectionId, TextureConfig> = {
  about: {
    albedo: "/textures/8k_earth_daymap.jpg",
    label: "Олимпиадын тухай",
    color: "#10b981",
  },
  rules: {
    albedo: "/textures/8k_mars.jpg",
    label: "Шалгалт",
    color: "#f97316",
  },
  prizes: {
    albedo: "/textures/8k_jupiter.jpg",
    label: "Шагналын сан",
    color: "#a855f7",
  },
  sponsor: {
    albedo: "/textures/8k_saturn.jpg",
    label: "Ивээн тэтгэч",
    color: "#3b82f6",
  },
  contact: {
    albedo: "/textures/8k_mercury.jpg",
    label: "Холбоо барих",
    color: "#8b5cf6",
  },
  register: {
    albedo: "/textures/8k_venus_surface.jpg",
    label: "Бүртгүүлэх",
    color: "#14b8a6",
  },
  faq: {
    albedo: "/textures/2k_uranus.jpg",
    label: "Асуулт",
    color: "#06b6d4",
  },
};

// Planet configurations with proper spacing
export const PLANET_CONFIGS: PlanetConfig[] = [
  { id: "about", radius: 2.2, size: 0.35, angle: 0, orbitSpeed: 0.08 },
  { id: "rules", radius: 3.0, size: 0.38, angle: 1.2, orbitSpeed: 0.06 },
  { id: "prizes", radius: 3.9, size: 0.42, angle: 2.5, orbitSpeed: 0.045 },
  { id: "sponsor", radius: 4.9, size: 0.4, angle: 3.8, orbitSpeed: 0.035 },
  { id: "contact", radius: 5.8, size: 0.36, angle: 5.0, orbitSpeed: 0.028 },
  { id: "register", radius: 6.8, size: 0.39, angle: 0.8, orbitSpeed: 0.022 },
  { id: "faq", radius: 7.7, size: 0.37, angle: 2.2, orbitSpeed: 0.018 },
];

// Ordered list for navigation
export const ORDERED_SECTIONS: SectionId[] = [
  "about",
  "rules",
  "prizes",
  "sponsor",
  "contact",
  "register",
  "faq",
];

// Performance constants
export const PERFORMANCE = {
  STAR_COUNT: 2000, // Reduced from 2500
  CAMERA_LERP_SPEED: 0.00008,
  WARP_SPEED_MULTIPLIER: 220,
  STAR_RESET_DISTANCE: 120,
  CAMERA_POSITION_THRESHOLD: 0.02,
  SCROLL_DEBOUNCE: 2000,
  SCROLL_THRESHOLD: 50,
  INSTRUCTIONS_TIMEOUT: 5000,
} as const;
