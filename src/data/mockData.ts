export const MOCK_USER = {
  name: "John Smith",
  email: "john@example.com",
  avatar: "https://i.pravatar.cc/100?img=12",
  unreadMail: 3,
};

export const MOCK_MEALS = [
  { id: 1, category: "Fruit", icon: "🍓", food: "Raspberries", amount: "1 Cup", status: "swap" },
  { id: 2, category: "Meat",  icon: "🥩", food: "Whole egg",   amount: "2 Items", status: "swap" },
  { id: 3, category: "Bread", icon: "🍞", food: "Bran flakes", amount: "4 Items", status: "swap" },
  { id: 4, category: "Free",  icon: "🥗", food: "Added Free Food", amount: "—",  status: "track" },
];

export const MOCK_TRACKER_DATA = [
  { month: "JAN", value: 560 }, { month: "FEB", value: 760 },
  { month: "MAR", value: 720 }, { month: "APR", value: 880 },
  { month: "MAY", value: 420 }, { month: "JUN", value: 760 },
];

export const SPARKLINE = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    x: i,
    y: 40 + Math.sin((i + seed) * 0.7) * 18 + Math.cos(i * 0.4) * 6,
  }));