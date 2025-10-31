interface SponsorPanelProps {
  onClose: () => void;
}

export default function SponsorPanel({ onClose }: SponsorPanelProps) {
  const content = {
    title: "Ивээн тэтгэгчид",
    description: "Олимпиадыг дэмжиж буй байгууллагууд.",
    tiers: [
      {
        level: "Үндсэн ивээн тэтгэгч",
        sponsors: [
          {
            name: "Tech Corporation Mongolia",
            description: "Технологийн салбарын тэргүүлэгч компани",
          },
        ],
        color: "from-yellow-500/20 to-yellow-600/20",
        borderColor: "border-yellow-500/50",
      },
      {
        level: "Мөнгө ивээн тэтгэгч",
        sponsors: [
          {
            name: "Innovation Hub",
            description: "Стартап хөгжүүлэлтийн төв",
          },
          {
            name: "Digital Solutions LLC",
            description: "Програм хангамжийн шийдэл",
          },
        ],
        color: "from-gray-400/20 to-gray-500/20",
        borderColor: "border-gray-400/50",
      },
      {
        level: "Хүрэл ивээн тэтгэгч",
        sponsors: [
          {
            name: "Education Platform",
            description: "Онлайн сургалтын платформ",
          },
          {
            name: "Cloud Services MN",
            description: "Үүлэн үйлчилгээ",
          },
          {
            name: "AI Research Center",
            description: "Хиймэл оюуны судалгааны төв",
          },
        ],
        color: "from-orange-600/20 to-orange-700/20",
        borderColor: "border-orange-600/50",
      },
    ],
    footer:
      "Бидний хамтрагчид болохыг урьж байна. Холбоо барих: sponsor@olympiad.mn",
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

      <div className="space-y-6">
        {content.tiers.map((tier, index) => (
          <div key={index} className="space-y-3">
            <h3 className="text-xl font-semibold text-purple-400">
              {tier.level}
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {tier.sponsors.map((sponsor, i) => (
                <div
                  key={i}
                  className={`bg-linear-to-r ${tier.color} backdrop-blur-sm rounded-lg p-5 border ${tier.borderColor} hover:scale-[1.02] transition-transform`}
                >
                  <h4 className="text-white font-bold text-lg mb-1">
                    {sponsor.name}
                  </h4>
                  <p className="text-gray-300 text-sm">{sponsor.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-purple-500/10 rounded-lg p-6 border border-purple-500/30 text-center">
        <p className="text-gray-300">{content.footer}</p>
      </div>
    </div>
  );
}
