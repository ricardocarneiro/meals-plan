import { Search, Mail } from "lucide-react";
import { brand } from "../../theme/tokens";

type User = { name: string; avatar: string; unreadMail: number };

export function Topbar({ user }: { user: User }) {
  return (
    <header className="h-36 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search meals, recipes, exercises…"
          className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>
      <div className="flex items-center gap-5">
        <button className="relative w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
          <Mail size={18} className="text-gray-600" />
          {user.unreadMail > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1.5"
                  style={{ background: brand.primary }}>
              {user.unreadMail}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <img src={user.avatar} alt={user.name}
               className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100" />
          <div className="text-sm">
            <div className="font-semibold" style={{ color: brand.ink }}>{user.name}</div>
            <div className="text-xs" style={{ color: brand.inkSoft }}>Member</div>
          </div>
        </div>
      </div>
    </header>
  );
}