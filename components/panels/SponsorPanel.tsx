import { SectionContent } from "@/lib/galaxy-types";

interface SponsorPanelProps {
  content: SectionContent;
  onClose: () => void;
}

export default function SponsorPanel({ content, onClose }: SponsorPanelProps) {
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

      {/* Details List */}
      <div className="space-y-4">
        {content.details.map((detail, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <p className="text-white text-lg">{detail}</p>
          </div>
        ))}
      </div>

      {/* Custom Content - Add your own sections here */}
      <div className="mt-8 space-y-4">
        {/* Example: Add sponsor logos, partner information according to Figma */}
        {/* <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Our Partners
          </h3>
          <div className="grid grid-cols-3 gap-4">
            Add sponsor logos here
          </div>
        </div> */}
      </div>
    </div>
  );
}
