interface PrizesPanelProps {
  onClose: () => void;
}

export default function PrizesPanel({ onClose }: PrizesPanelProps) {
  const content = {
    title: "Шагналын сан",
    description: "Тэргүүн байранд шалгарсан оролцогчдод өгөх урамшууллын сан.",
    prizes: [
      {
        rank: "1-р байр",
        amount: "₮5,000,000",
        color: "from-yellow-500 to-yellow-600",

        benefits: ["Мөнгөн шагнал", "Сертификат", "Тусгай урамшуулал"],
      },
      {
        rank: "2-р байр",
        amount: "₮3,000,000",
        color: "from-gray-400 to-gray-500",

        benefits: ["Мөнгөн шагнал", "Сертификат", "Урамшуулал"],
      },
      {
        rank: "3-р байр",
        amount: "₮1,500,000",
        color: "from-orange-600 to-orange-700",

        benefits: ["Мөнгөн шагнал", "Сертификат"],
      },
    ],
    additional: [
      "Онцгой шагналууд тодорхой категориудад",
      "Оролцогч бүрт сертификат олгоно",
      "Шилдэг багуудад хөтөлбөрийн эрх",
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

      <div className="space-y-4">
        {content.prizes.map((prize, index) => (
          <div
            key={index}
            className={`bg-linear-to-r ${prize.color} bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-2xl">{prize.rank}</h3>
                <p className="text-3xl font-bold text-purple-400 mt-1">
                  {prize.amount}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {prize.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">•</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-linear-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-6 border border-purple-500/20">
        <h3 className="text-xl font-semibold text-white mb-3">
          Нэмэлт урамшуулал
        </h3>
        <ul className="space-y-2">
          {content.additional.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
