export type Service = {
  slug: "cleaning" | "handyman" | "plumbing";
  name: string;
  tagline: string;
  hourlyRate: number; // SGD
  minHours: number;
  rating: number;
  reviews: number;
  bookings: string;
  emoji: string;
  description: string;
  includes: string[];
  addons: { id: string; name: string; price: number }[];
};

export const SERVICES: Service[] = [
  {
    slug: "cleaning",
    name: "Home Cleaning",
    tagline: "Verified part-time cleaners",
    hourlyRate: 28,
    minHours: 2,
    rating: 4.9,
    reviews: 12480,
    bookings: "120k+ bookings",
    emoji: "🧹",
    description:
      "Trusted, vetted cleaners for HDB, condo and landed homes across Singapore. Bring your own supplies or add equipment.",
    includes: [
      "Dusting, vacuuming and mopping",
      "Kitchen wipe-down and stovetop",
      "Bathroom sanitisation",
      "Bedroom tidying and bedding change",
    ],
    addons: [
      { id: "fridge", name: "Inside fridge cleaning", price: 18 },
      { id: "oven", name: "Inside oven cleaning", price: 22 },
      { id: "ironing", name: "Ironing (per 30 min)", price: 14 },
    ],
  },
  {
    slug: "handyman",
    name: "Handyman",
    tagline: "General repairs and installs",
    hourlyRate: 45,
    minHours: 1,
    rating: 4.8,
    reviews: 5230,
    bookings: "40k+ bookings",
    emoji: "🛠️",
    description:
      "Mounting, assembly, drilling, door and lock repairs by licensed handymen. Tools included.",
    includes: [
      "TV / shelf wall mounting",
      "Furniture assembly",
      "Door, hinge and lock repair",
      "Minor electrical fixes",
    ],
    addons: [
      { id: "drill", name: "Heavy-duty drilling", price: 20 },
      { id: "disposal", name: "Old item disposal", price: 25 },
    ],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    tagline: "Licensed PUB plumbers",
    hourlyRate: 60,
    minHours: 1,
    rating: 4.9,
    reviews: 3120,
    bookings: "25k+ bookings",
    emoji: "🔧",
    description:
      "PUB-licensed plumbers for leaks, chokes, water heaters and bathroom fittings. Same-day slots available.",
    includes: [
      "Leak detection and repair",
      "Clearing choked sinks and toilets",
      "Tap and shower replacement",
      "Water heater servicing",
    ],
    addons: [
      { id: "parts", name: "Standard parts kit", price: 35 },
      { id: "urgent", name: "Same-day urgent slot", price: 25 },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
