import { Hand, UserRound, Hash, Users, UtensilsCrossed, Palette, House, CalendarDays, Bus, ShoppingBag, Footprints, Clock, Plane, HeartPulse, Briefcase, Trophy, CloudSun, Shirt, Smile, ShoppingCart, Landmark, Smartphone, Luggage, HardHat, Sofa, Sunrise, Cake, Coffee, Map, Phone, TrainFront, BookOpen, type LucideIcon } from "lucide-react";

// Maps the app's emoji keys to SVG icons so they render identically on every device.
const MAP: Record<string, LucideIcon> = {
  "👋": Hand, "🙋": UserRound, "🔢": Hash, "👨‍👩‍👧": Users, "🍽️": UtensilsCrossed, "🎨": Palette, "🏠": House, "📅": CalendarDays,
  "🚌": Bus, "🛍️": ShoppingBag, "🏃": Footprints, "⏰": Clock, "✈️": Plane, "🏥": HeartPulse, "💼": Briefcase, "⚽": Trophy,
  "🌦️": CloudSun, "👕": Shirt, "😊": Smile, "🛒": ShoppingCart, "🏛️": Landmark, "📱": Smartphone, "🧳": Luggage, "👷": HardHat,
  "🛋️": Sofa, "🌅": Sunrise, "🎂": Cake, "☕": Coffee, "🗺️": Map, "📞": Phone, "🚆": TrainFront,
};
export default function UnitIcon({ k, size = 24 }: { k: string; size?: number }) {
  const I = MAP[k] ?? BookOpen;
  return <I size={size} aria-hidden strokeWidth={1.9} />;
}
