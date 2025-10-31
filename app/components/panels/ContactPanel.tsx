interface ContactPanelProps {
  onClose: () => void;
}

export default function ContactPanel({ onClose }: ContactPanelProps) {
  const content = {
    title: "Холбоо барих",
    description: "Асуулт, санал хүсэлт байвал бидэнтэй холбогдоорой.",
    contacts: [
      {
        type: "Имэйл",
        value: "info@olympiad.mn",

        link: "mailto:info@olympiad.mn",
      },
      {
        type: "Утас",
        value: "+976 7777-8888",

        link: "tel:+97677778888",
      },
      {
        type: "Facebook",
        value: "facebook.com/olympiad",

        link: "https://facebook.com/olympiad",
      },
      {
        type: "Хаяг",
        value: "Улаанбаатар хот, Сүхбаатар дүүрэг",

        link: null,
      },
    ],
    hours: {
      title: "Ажлын цаг",
      schedule: ["Даваа - Баасан: 9:00 - 18:00", "Амралтын өдөр: Хаалттай"],
    },
    faq: "Түгээмэл асуултын хариултыг FAQ хэсгээс үзнэ үү.",
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

      <div className="grid gap-4 md:grid-cols-2">
        {content.contacts.map((contact, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all"
          >
            <div>
              <h3 className="text-white font-semibold mb-1">{contact.type}</h3>
              {contact.link ? (
                <a
                  href={contact.link}
                  className="text-purple-400 hover:text-purple-300 transition-colors break-all"
                >
                  {contact.value}
                </a>
              ) : (
                <p className="text-gray-300">{contact.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-linear-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-6 border border-purple-500/20">
        <h3 className="text-xl font-semibold text-white mb-3">
          {content.hours.title}
        </h3>
        <ul className="space-y-2">
          {content.hours.schedule.map((time, index) => (
            <li key={index} className="text-gray-300">
              {time}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-gray-300">{content.faq}</p>
      </div>
    </div>
  );
}
