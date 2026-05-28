import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { brand } from "./theme/tokens";
import { useProfile } from "./hooks/useProfile";
import { ensureTodaysMeals } from "./hooks/useMealTemplates"; 
import { LoginPage } from "./components/auth/LoginPage";
import { SignupPage } from "./components/auth/SignupPage";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  const [route, setRoute] = useState<"login" | "signup" | "app">("login");
  const [session, setSession] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setRoute(session ? "app" : "login");
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setRoute(session ? "app" : "login");
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      ensureTodaysMeals().then(({ count, error }) => {
        if (error) console.error("ensureTodaysMeals failed:", error);
        else if (count && count > 0) console.log(`✓ Created ${count} meals for today from template`);
      });
    }
  }, [session]);

  const userId = session?.user?.id;
  const { profile, loading: profileLoading, updateProfile } = useProfile(userId);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRoute("login");
  };

  // Build user object using REAL profile data from Supabase
  const user = session?.user ? {
    id: session.user.id,
    name: profile?.full_name || session.user.email?.split("@")[0] || "User",
    email: session.user.email || "",
    avatar: profile?.avatar_url || `https://i.pravatar.cc/100?u=${session.user.id}`,
    unreadMail: 3,
  } : null;

  if (checking || (session && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: brand.bg }}>
        <div className="text-sm" style={{ color: brand.inkSoft }}>Loading…</div>
      </div>
    );
  }

  if (route === "login")  return <LoginPage  onLogin={() => setRoute("app")} onSwitch={() => setRoute("signup")} />;
  if (route === "signup") return <SignupPage onSignup={() => setRoute("app")} onSwitch={() => setRoute("login")} />;
  if (!user || !profile) return null;

  return <Dashboard user={user} profile={profile} updateProfile={updateProfile} onLogout={handleLogout} />;
}