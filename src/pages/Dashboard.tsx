import { useState } from "react";
import { brand } from "../theme/tokens";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { Overview } from "./Overview";
import { ProfilePage } from "./ProfilePage";
import { ResetWeekPage } from "./ResetWeekPage";
import { MealPlanPage } from "./MealPlanPage";        // ← novo import
import { Placeholder } from "../components/shared/Placeholder";
import { PAGE_CONFIG } from "../config/navigation";
import type { Profile } from "../hooks/useProfile";

type User = { id: string; name: string; avatar: string; unreadMail: number; email: string };

type Props = {
  user: User;
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  onLogout: () => void;
};

export function Dashboard({ user, profile, updateProfile, onLogout }: Props) {
  const [active, setActive] = useState("overview");

  const renderPage = () => {
    if (active === "overview")   return <Overview user={user} profile={profile} />;
    if (active === "profile")    return <ProfilePage profile={profile} email={user.email} updateProfile={updateProfile} />;
    if (active === "meal-plan")  return <MealPlanPage userId={user.id} />;        // ← nova linha
    if (active === "reset-week") return <ResetWeekPage userId={user.id} onDone={() => setActive("overview")} />;
    return <Placeholder {...PAGE_CONFIG[active]} />;
  };

  return (
    <div className="min-h-screen flex" style={{ background: brand.bg }}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}