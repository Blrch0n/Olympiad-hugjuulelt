interface RegisterPanelProps {
  onClose: () => void;
}

export default function RegisterPanel({ onClose }: RegisterPanelProps) {
  const content = {
    title: "Бүртгүүлэх",
    description: "Олимпиадад оролцохын тулд дараах алхмуудыг дагана уу.",
    steps: [
      {
        number: 1,
        title: "Бүртгэл үүсгэх",
        description: "Өөрийн мэдээллээ оруулж бүртгэл үүсгэнэ үү.",
      },
      {
        number: 2,
        title: "Имэйл баталгаажуулах",
        description: "Таны имэйл хаяг руу ирсэн холбоосыг дарна уу.",
      },
      {
        number: 3,
        title: "Төлбөр төлөх",
        description: "Оролцооны хураамжаа төлж баталгаажуулна уу.",
      },
      {
        number: 4,
        title: "Шалгалтанд орох",
        description: "Тогтоосон хугацаанд шалгалтанд оролцоно уу.",
      },
    ],
    requirements: [
      "Монгол улсын иргэн байх",
      "18-25 насны хооронд байх",
      "Их дээд сургуульд суралцаж байгаа эсвэл төгссөн",
      "Програмчлалын үндсэн мэдлэгтэй",
    ],
    fee: "Оролцооны хураамж: ₮50,000",
    deadline: "Бүртгэлийн эцсийн хугацаа: 2024 оны 3-р сарын 31",
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
        {content.steps.map((step, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/50">
                <span className="text-purple-400 font-bold text-xl">
                  {step.number}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-linear-to-r from-orange-500/10 to-orange-600/10 rounded-lg p-6 border border-orange-500/20">
        <h3 className="text-xl font-semibold text-white mb-3">Шаардлага</h3>
        <ul className="space-y-2">
          {content.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-300">
              <span className="text-orange-400 mt-1">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-purple-500/10 rounded-lg p-5 border border-purple-500/30 text-center">
          <p className="text-white font-semibold">{content.fee}</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-5 border border-purple-500/30 text-center">
          <p className="text-white font-semibold">{content.deadline}</p>
        </div>
      </div>

      <div className="text-center pt-4">
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
          Одоо бүртгүүлэх
        </button>
      </div>
    </div>
  );
}
