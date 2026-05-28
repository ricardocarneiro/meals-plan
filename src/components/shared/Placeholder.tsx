import { ChevronRight } from "lucide-react";
import { brand } from "../../theme/tokens";

type Props = { title: string; desc: string; icon: any };

export function Placeholder({ title, desc, icon: Icon }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
           style={{ background: brand.primarySoft }}>
        <Icon size={28} style={{ color: brand.primary }} />
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: brand.ink }}>{title}</h2>
      <p className="max-w-md mx-auto" style={{ color: brand.inkSoft }}>{desc}</p>
      <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition hover:shadow-lg"
              style={{ background: brand.primary }}>
        Get started <ChevronRight size={16} />
      </button>
    </div>
  );
}