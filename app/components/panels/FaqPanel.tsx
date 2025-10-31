interface FaqPanelProps {
  onClose: () => void;
}

export default function FaqPanel({ onClose }: FaqPanelProps) {
  const content = {
    title: "Түгээмэл асуулт хариулт",
    description: "Олимпиадын талаар түгээмэл асуудаг асуултуудын хариулт.",
    faqs: [
      {
        question: "Олимпиад хэзээ болох вэ?",
        answer:
          "Олимпиад 2024 оны 4-р сард явагдах бөгөөд нарийвчилсан хуваарь удахгүй зарлагдана.",
      },
      {
        question: "Хэн оролцох эрхтэй вэ?",
        answer:
          "18-25 насны, их дээд сургуульд суралцаж байгаа эсвэл төгссөн Монгол улсын иргэд оролцох боломжтой.",
      },
      {
        question: "Оролцооны хураамж хэд вэ?",
        answer:
          "Оролцооны хураамж нь 50,000 төгрөг бөгөөд энэ нь шалгалтын материал, сертификатыг багтаана.",
      },
      {
        question: "Ямар төрлийн асуултууд гарах вэ?",
        answer:
          "Програмчлал, алгоритм, өгөгдлийн бүтэц, математик зэрэг сэдвүүдээс асуултууд гарна.",
      },
      {
        question: "Хэдэн шат байдаг вэ?",
        answer:
          "Нийт 3 шат байна: Онлайн урьдчилсан шалгалт, Хагас шигшээ, Шигшээ шалгалт.",
      },
      {
        question: "Компьютер өөртөө авчрах шаардлагатай юу?",
        answer:
          "Онлайн шатанд өөрийн төхөөрөмж ашиглана. Шигшээ шатанд байгууллага компьютер бэлтгэнэ.",
      },
    ],
    contact: "Таны асуулт энд байхгүй бол бидэнтэй холбогдоно уу.",
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
        {content.faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all"
          >
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-linear-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-6 border border-purple-500/20 text-center">
        <p className="text-gray-300 mb-4">{content.contact}</p>
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
          Холбоо барих
        </button>
      </div>
    </div>
  );
}
