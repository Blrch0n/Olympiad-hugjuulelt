import { SectionId } from "@/app/lib/galaxy-types";
import { PANEL_COMPONENTS } from "../panels/panel-mapper";

interface ShowcasePanelProps {
  id: SectionId;
  onBack: () => void;
}

export default function ShowcasePanel({ id, onBack }: ShowcasePanelProps) {
  const PanelComponent = PANEL_COMPONENTS[id];

  if (!PanelComponent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-end p-4 md:p-6">
      <div className="w-full md:w-[45%] max-w-lg pointer-events-auto">
        <div className="showcase-panel-content bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
          <PanelComponent onClose={onBack} />
        </div>
      </div>
    </div>
  );
}
