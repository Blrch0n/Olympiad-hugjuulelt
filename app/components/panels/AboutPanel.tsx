interface AboutPanelProps {
  onClose: () => void;
}

export default function AboutPanel({ onClose }: AboutPanelProps) {
  const content = {
    title: "Олимпиадын тухай",
    description:
      "Манай олимпиад нь залуу авьяаслаг хүмүүсийг нэгтгэн, мэдлэг чадвараа дэлгэрүүлэх боломжийг олгоно.",
    highlights: [
      {
        title: "Улс хоорондын түвшин",
        description: "Олон улсын стандартад нийцсэн тэмцээн",
      },
      {
        title: "Жил бүр зохион байгуулагддаг",
        description: "Тогтмол хугацаанд зохион байгуулагддаг",
      },
      {
        title: "1000+ оролцогч",
        description: "Өргөн хүрээтэй оролцоо",
      },
      {
        title: "Шинэ санаа, чадвар",
        description: "Авьяасаа дэлгэрүүлэх боломж",
      },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.highlights.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all"
          >
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-linear-to-r from-emerald-500/10 to-emerald-600/10 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-xl font-semibold text-white mb-3">
          Олимпиадын зорилго
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Оюутнуудын мэдлэг, чадвар, сэтгэн бодох хурдыг дээшлүүлж, тэдний
          хөгжилд хувь нэмэр оруулахыг зорьж байна. Бид залуу авьяаслаг
          хүмүүсийг олон улсын түвшинд өрсөлдөх боломжоор хангахыг эрмэлздэг.
        </p>
      </div>
    </div>
  );
}
