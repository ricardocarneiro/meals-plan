import { brand } from "../../theme/tokens";

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
          style={{ color: brand.inkSoft }}>{label}</span>
    {children}
  </label>
);