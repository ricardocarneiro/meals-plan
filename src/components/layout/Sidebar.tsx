import { brand } from "../../theme/tokens";
import { NAV } from "../../config/navigation";

type Props = { active: string; setActive: (id: string) => void; onLogout: () => void };

export function Sidebar({ active, setActive, onLogout }: Props) {
  const Item = ({ item }: { item: { id: string; label: string; icon: any } }) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    return (
      <button
        onClick={() => item.id === "logout" ? onLogout() : setActive(item.id)}
        className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition relative
          ${isActive ? "font-semibold" : "hover:bg-gray-50"}`}
        style={{ color: isActive ? brand.primary : "#4B5563" }}
      >
        {isActive && (
          <span className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                style={{ background: brand.primary }} />
        )}
        <Icon size={18} strokeWidth={1.8} />
        <span>{item.label}</span>
      </button>
    );
  };

  const Section = ({ title, items }: { title: string; items: any[] }) => (
    <div className="mb-6">
      <div className="px-5 mb-2 text-xs font-bold tracking-widest" style={{ color: brand.primary }}>
        {title}
      </div>
      <div className="flex flex-col">
        {items.map((it) => <Item key={it.id} item={it} />)}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Brand block — height matches Topbar (h-44 = 176px) so the bottom of the logo aligns with the bottom of the Topbar */}
      <div className="h-44 flex flex-col items-center justify-center border-b border-gray-100 pt-2 pb-4">
        <img src="/logo.png" alt="Plate & Plan" className="h-32 w-auto object-contain" />
      </div>

      <nav className="flex-1 overflow-y-auto pt-6 pb-6">
        <Section title="DASHBOARD" items={NAV.DASHBOARD} />
        <Section title="EXTRAS" items={NAV.EXTRAS} />
        <Section title="ACCOUNT" items={NAV.ACCOUNT} />
      </nav>
    </aside>
  );
}