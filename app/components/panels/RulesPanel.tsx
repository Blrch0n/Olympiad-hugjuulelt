interface RulesPanelProps {
  onClose: () => void;
}

export default function RulesPanel({ onClose }: RulesPanelProps) {
  const content = {
    title: "Шалгалт",
    description:
      "Шалгалтын үе шат, дүрэм журам болон үнэлгээний шалгуурын талаар мэдээлэл.",
    stages: [
      {
        number: 1,
        title: "Анхан шат",
        duration: "2 цаг",
        format: "Онлайн",
        description: "Үндсэн мэдлэгийн шалгалт",
      },
      {
        number: 2,
        title: "Дунд шат",
        duration: "2 цаг",
        format: "Онлайн/Офлайн",
        description: "Нарийвчилсан асуултууд",
      },
      {
        number: 3,
        title: "Финал",
        duration: "2 цаг",
        format: "Офлайн",
        description: "Төгсгөлийн шалгалт",
      },
    ],
    requirements: [
      "Мэргэжлийн шалгуур үзүүлэлтээр үнэлнэ",
      "Бүх шалгалт стандартчилагдсан",
      "Шударга үнэлгээний систем",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {content.title}
          </h2>
          <p className="text-gray-300 text-lg">{content.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {content.stages.map((stage, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center border-2 border-orange-500/50">
                <span className="text-orange-400 font-bold text-xl">
                  {stage.number}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-xl mb-2">
                  {stage.title}
                </h3>
                <div className="flex flex-wrap gap-3 mb-2">
                  <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm">
                    {stage.duration}
                  </span>
                  <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm">
                    {stage.format}
                  </span>
                </div>
                <p className="text-gray-400">{stage.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-linear-to-r from-orange-500/10 to-orange-600/10 rounded-lg p-6 border border-orange-500/20">
        <h3 className="text-xl font-semibold text-white mb-3">
          Үнэлгээний шалгуур
        </h3>
        <ul className="space-y-2">
          {content.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-300">
              <span className="text-orange-400 mt-1">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
