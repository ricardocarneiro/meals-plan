import {
  Home, Utensils, Activity, ShoppingBag, User, PlayCircle, Trophy,
  ChefHat, Dumbbell, BookOpen, HelpCircle, Settings, Pause,
  RotateCcw, LogOut,
} from "lucide-react";

export const NAV = {
  DASHBOARD: [
    { id: "overview",     label: "Overview",     icon: Home },
    { id: "meal-plan",    label: "Meal Plan",    icon: Utensils },
    { id: "measurements", label: "Measurements", icon: Activity },
    { id: "shop",         label: "Shop",         icon: ShoppingBag },
    { id: "profile",      label: "Profile",      icon: User },
    { id: "videos",       label: "Videos",       icon: PlayCircle },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ],
  EXTRAS: [
    { id: "recipes",   label: "Recipes",        icon: ChefHat },
    { id: "fitness",   label: "Fitness",        icon: Dumbbell },
    { id: "resources", label: "Resources",      icon: BookOpen },
    { id: "support",   label: "Support Center", icon: HelpCircle },
  ],
  ACCOUNT: [
    { id: "settings",   label: "Settings",   icon: Settings },
    { id: "pause",      label: "Pause",      icon: Pause },
    { id: "reset-week", label: "Reset Week", icon: RotateCcw },
    { id: "logout",     label: "Logout",     icon: LogOut },
  ],
};

export const PAGE_CONFIG: Record<string, { title: string; desc: string; icon: any }> = {
  "meal-plan":    { title: "Meal Plan",        desc: "Plan your week of meals tailored to your goals.", icon: Utensils },
  "measurements": { title: "Measurements",     desc: "Track weight, body fat, and progress photos.", icon: Activity },
  "shop":         { title: "Shop",             desc: "Curated supplements and meal-prep gear.", icon: ShoppingBag },
  "profile":      { title: "Profile",          desc: "Manage your personal information.", icon: User },
  "videos":       { title: "Videos",           desc: "Watch coaching and recipe videos.", icon: PlayCircle },
  "achievements": { title: "Achievements",     desc: "Your milestones and streaks live here.", icon: Trophy },
  "recipes":      { title: "Recipes",          desc: "Browse hundreds of healthy recipes.", icon: ChefHat },
  "fitness":      { title: "Fitness",          desc: "Workouts that pair with your meal plan.", icon: Dumbbell },
  "resources":    { title: "Resources",        desc: "Guides, articles, and downloadable PDFs.", icon: BookOpen },
  "support":      { title: "Support Center",   desc: "We're here to help you succeed.", icon: HelpCircle },
  "settings":     { title: "Account Settings", desc: "Update preferences, billing, and notifications.", icon: Settings },
  "pause":        { title: "Pause Plan",       desc: "Take a break — we'll save your progress.", icon: Pause },
  "reset-week":   { title: "Reset Week",       desc: "Start a fresh week of tracking.", icon: RotateCcw },
};