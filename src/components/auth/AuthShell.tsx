import { brand } from "../../theme/tokens";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
         style={{ background: "linear-gradient(135deg, #E8F8F1 0%, #F4F6F8 60%)" }}>
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 blur-3xl"
           style={{ background: brand.primary }} />
      <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
           style={{ background: "#7DD9B4" }} />
      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <img src="/logo.png" alt="Plate & Plan" className="h-16 w-auto object-contain" />
          <div className="leading-tight">
            <div className="text-2xl font-bold tracking-tight" style={{ color: "#0F766E" }}>
              Plate & Plan
            </div>
            <div className="text-[11px] font-medium tracking-wider" style={{ color: brand.inkSoft }}>
              SMART · FRESH · HEALTHY
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}