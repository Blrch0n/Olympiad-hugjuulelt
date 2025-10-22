"use client";

import React, { useState } from "react";
import GlossyPlanet, { PlanetPresets } from "@/components/GlossyPlanet";

type SectionId =
  | "about"
  | "rules"
  | "prizes"
  | "sponsor"
  | "contact"
  | "register"
  | "faq";

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

const SECTIONS = [
  {
    id: "about" as SectionId,
    label: "Олимпиадын тухай",
    color: PlanetPresets.green,
  },
  { id: "rules" as SectionId, label: "Шалгалт", color: PlanetPresets.orange },
  {
    id: "prizes" as SectionId,
    label: "Шагналын сан",
    color: PlanetPresets.purple,
  },
  {
    id: "sponsor" as SectionId,
    label: "Ивээн тэтгэч",
    color: PlanetPresets.blue,
  },
  {
    id: "contact" as SectionId,
    label: "Холбоо барих",
    color: PlanetPresets.cyan,
  },
  {
    id: "register" as SectionId,
    label: "Бүртгүүлэх",
    color: PlanetPresets.teal,
  },
  { id: "faq" as SectionId, label: "Асуулт", color: PlanetPresets.pink },
];

export default function SimpleGalaxy() {
  const [selected, setSelected] = useState<SectionId | null>(null);

  const handlePlanetClick = (id: SectionId) => {
    setSelected(selected === id ? null : id);
  };

  const selectedContent = selected ? CONTENT[selected] : null;
  const selectedSection = SECTIONS.find((s) => s.id === selected);

  return (
    <div className="min-h-screen bg-[#060a18] text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 bg-linear-to-br from-[#060a18] via-[#0a1128] to-[#060a18]">
        {/* Stars */}
        <div className="absolute inset-0 opacity-50">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center pt-16 pb-8 px-4">
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            ОЛИМПИАД 2025
          </h1>
          <p className="text-xl text-gray-400">
            🚀 Гаригууд дээр дарж дэлгэрэнгүй мэдээлэл үзнэ үү
          </p>
        </header>

        {/* Solar system layout */}
        <div className="container mx-auto px-4">
          {!selected ? (
            // Hub view - all planets in orbit
            <div className="relative h-[700px] flex items-center justify-center mb-12">
              {/* Central sun - clean, no rays */}
              <div className="absolute">
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-yellow-400 via-orange-500 to-orange-600">
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">
                    ☀️
                  </div>
                </div>
              </div>

              {/* Orbit ring */}
              <div className="absolute w-[600px] h-[600px] rounded-full border border-white/10" />

              {/* Planets */}
              {SECTIONS.map((section, index) => {
                const angle =
                  (index / SECTIONS.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 280;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={section.id}
                    className="absolute transition-all duration-500 hover:z-10"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <GlossyPlanet
                      color={section.color}
                      size={100}
                      label={section.label}
                      isActive={false}
                      onClick={() => handlePlanetClick(section.id)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            // Detail view - Planet LEFT, Content RIGHT
            <div className="fixed inset-0 flex items-center justify-center bg-[#060a18]/80 backdrop-blur-sm z-10">
              <div className="w-full h-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 flex items-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-[400px_1fr] lg:grid-cols-[500px_1fr] gap-8 md:gap-12 lg:gap-16 items-center">
                  {/* Planet showcase - LEFT SIDE */}
                  <div className="flex justify-center md:justify-end items-center animate-scaleIn">
                    <GlossyPlanet
                      color={selectedSection!.color}
                      size={240}
                      label={selectedSection!.label}
                      isActive={true}
                    />
                  </div>

                  {/* Content - RIGHT SIDE */}
                  <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl space-y-4 md:space-y-6 animate-slideInRight max-h-[75vh] overflow-y-auto">
                    <div>
                      <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 animate-fadeIn"
                        style={{
                          color: selectedSection!.color,
                          textShadow: `0 0 30px ${
                            selectedSection!.color
                          }88, 0 0 50px ${selectedSection!.color}44`,
                        }}
                      >
                        {selectedContent!.title}
                      </h2>
                      <p
                        className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed animate-fadeIn"
                        style={{ animationDelay: "100ms" }}
                      >
                        {selectedContent!.description}
                      </p>
                    </div>

                    <ul className="space-y-3 md:space-y-4">
                      {selectedContent!.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="text-sm md:text-base lg:text-lg text-gray-200 flex items-start gap-3 animate-fadeIn"
                          style={{ animationDelay: `${idx * 80 + 200}ms` }}
                        >
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelected(null)}
                      className="w-full inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-10 py-3 md:py-4 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{
                        boxShadow: `0 0 40px ${
                          selectedSection!.color
                        }50, inset 0 0 20px ${selectedSection!.color}20`,
                      }}
                    >
                      <span className="text-lg md:text-xl">←</span>
                      <span>Буцах</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation pills */}
        <nav className="fixed top-6 right-6 flex flex-wrap gap-2 max-w-md z-20">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handlePlanetClick(section.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selected === section.id
                  ? "bg-white/20 border-2 scale-105"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
              style={{
                borderColor:
                  selected === section.id ? section.color : undefined,
                boxShadow:
                  selected === section.id
                    ? `0 0 20px ${section.color}60`
                    : undefined,
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Footer hint */}
        {!selected && (
          <div className="text-center pb-12 px-4">
            <p className="text-gray-500 text-sm animate-bounce">
              ⬆️ Click any planet to explore
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
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
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
