import type { Merchant } from "./calculate-risk"

/**
 * Realistic sample dataset. Includes deliberate edge cases:
 *  - M004: excellent revenue but inactive for 30 days
 *  - M007: low revenue but active daily
 *  - M012: many support tickets but high NPS
 *  - M001: all healthy metrics
 *  - M015: every negative signal
 */
export const merchants: Merchant[] = [
  { id: "M001", name: "ABC Fashion", category: "Fashion", plan: "Premium", accountAgeMonths: 18, monthlyRevenue: 180000, ordersLast30Days: 220, daysSinceLastLogin: 3, supportTickets: 0, npsScore: 9, assignedRep: "Priya Sharma", lastContactDaysAgo: 5 },
  { id: "M002", name: "Green Grocers", category: "Grocery", plan: "Standard", accountAgeMonths: 9, monthlyRevenue: 42000, ordersLast30Days: 65, daysSinceLastLogin: 6, supportTickets: 1, npsScore: 7, assignedRep: "Arjun Mehta", lastContactDaysAgo: 12 },
  { id: "M003", name: "TechHub Store", category: "Electronics", plan: "Premium", accountAgeMonths: 24, monthlyRevenue: 320000, ordersLast30Days: 140, daysSinceLastLogin: 2, supportTickets: 2, npsScore: 8, assignedRep: "Priya Sharma", lastContactDaysAgo: 3 },
  { id: "M004", name: "Luxe Interiors", category: "Home Decor", plan: "Enterprise", accountAgeMonths: 30, monthlyRevenue: 450000, ordersLast30Days: 90, daysSinceLastLogin: 30, supportTickets: 1, npsScore: 7, assignedRep: "Neha Kapoor", lastContactDaysAgo: 31 },
  { id: "M005", name: "Fresh Bites Cafe", category: "Food & Beverage", plan: "Standard", accountAgeMonths: 5, monthlyRevenue: 28000, ordersLast30Days: 48, daysSinceLastLogin: 10, supportTickets: 2, npsScore: 6, assignedRep: "Arjun Mehta", lastContactDaysAgo: 14 },
  { id: "M006", name: "Urban Kicks", category: "Footwear", plan: "Premium", accountAgeMonths: 14, monthlyRevenue: 95000, ordersLast30Days: 110, daysSinceLastLogin: 4, supportTickets: 0, npsScore: 8, assignedRep: "Priya Sharma", lastContactDaysAgo: 7 },
  { id: "M007", name: "Handmade Corner", category: "Crafts", plan: "Basic", accountAgeMonths: 7, monthlyRevenue: 6500, ordersLast30Days: 35, daysSinceLastLogin: 1, supportTickets: 1, npsScore: 8, assignedRep: "Rahul Verma", lastContactDaysAgo: 8 },
  { id: "M008", name: "PetPals Supplies", category: "Pets", plan: "Standard", accountAgeMonths: 11, monthlyRevenue: 54000, ordersLast30Days: 72, daysSinceLastLogin: 18, supportTickets: 2, npsScore: 5, assignedRep: "Arjun Mehta", lastContactDaysAgo: 20 },
  { id: "M009", name: "GlowSkin Beauty", category: "Beauty", plan: "Premium", accountAgeMonths: 20, monthlyRevenue: 130000, ordersLast30Days: 160, daysSinceLastLogin: 5, supportTickets: 1, npsScore: 9, assignedRep: "Neha Kapoor", lastContactDaysAgo: 6 },
  { id: "M010", name: "BookNook", category: "Books", plan: "Basic", accountAgeMonths: 3, monthlyRevenue: 9000, ordersLast30Days: 15, daysSinceLastLogin: 21, supportTickets: 0, npsScore: 6, assignedRep: "Rahul Verma", lastContactDaysAgo: 22 },
  { id: "M011", name: "FitGear Pro", category: "Sports", plan: "Standard", accountAgeMonths: 16, monthlyRevenue: 78000, ordersLast30Days: 88, daysSinceLastLogin: 8, supportTickets: 3, npsScore: 7, assignedRep: "Priya Sharma", lastContactDaysAgo: 9 },
  { id: "M012", name: "Cloud Kitchens Co", category: "Food & Beverage", plan: "Premium", accountAgeMonths: 22, monthlyRevenue: 210000, ordersLast30Days: 190, daysSinceLastLogin: 3, supportTickets: 6, npsScore: 9, assignedRep: "Neha Kapoor", lastContactDaysAgo: 4 },
  { id: "M013", name: "Nova Gadgets", category: "Electronics", plan: "Standard", accountAgeMonths: 6, monthlyRevenue: 33000, ordersLast30Days: 18, daysSinceLastLogin: 16, supportTickets: 4, npsScore: 5, assignedRep: "Arjun Mehta", lastContactDaysAgo: 17 },
  { id: "M014", name: "Bloom Florists", category: "Home Decor", plan: "Basic", accountAgeMonths: 4, monthlyRevenue: 12000, ordersLast30Days: 40, daysSinceLastLogin: 7, supportTickets: 1, npsScore: 7, assignedRep: "Rahul Verma", lastContactDaysAgo: 10 },
  { id: "M015", name: "Discount Depot", category: "General", plan: "Basic", accountAgeMonths: 2, monthlyRevenue: 4500, ordersLast30Days: 8, daysSinceLastLogin: 45, supportTickets: 7, npsScore: 3, assignedRep: "Arjun Mehta", lastContactDaysAgo: 46 },
  { id: "M016", name: "Artisan Roasters", category: "Food & Beverage", plan: "Premium", accountAgeMonths: 28, monthlyRevenue: 165000, ordersLast30Days: 130, daysSinceLastLogin: 2, supportTickets: 0, npsScore: 10, assignedRep: "Neha Kapoor", lastContactDaysAgo: 2 },
  { id: "M017", name: "Trend Threads", category: "Fashion", plan: "Standard", accountAgeMonths: 12, monthlyRevenue: 61000, ordersLast30Days: 55, daysSinceLastLogin: 12, supportTickets: 2, npsScore: 6, assignedRep: "Priya Sharma", lastContactDaysAgo: 13 },
  { id: "M018", name: "SmartHome Living", category: "Electronics", plan: "Enterprise", accountAgeMonths: 26, monthlyRevenue: 380000, ordersLast30Days: 205, daysSinceLastLogin: 1, supportTickets: 1, npsScore: 9, assignedRep: "Neha Kapoor", lastContactDaysAgo: 1 },
  { id: "M019", name: "Little Sprouts", category: "Kids", plan: "Basic", accountAgeMonths: 8, monthlyRevenue: 22000, ordersLast30Days: 12, daysSinceLastLogin: 20, supportTickets: 5, npsScore: 4, assignedRep: "Rahul Verma", lastContactDaysAgo: 21 },
  { id: "M020", name: "Peak Outdoors", category: "Sports", plan: "Premium", accountAgeMonths: 19, monthlyRevenue: 145000, ordersLast30Days: 118, daysSinceLastLogin: 6, supportTickets: 1, npsScore: 8, assignedRep: "Priya Sharma", lastContactDaysAgo: 8 },
  { id: "M021", name: "Vintage Vault", category: "Crafts", plan: "Standard", accountAgeMonths: 10, monthlyRevenue: 38000, ordersLast30Days: 17, daysSinceLastLogin: 15, supportTickets: 4, npsScore: 5, assignedRep: "Rahul Verma", lastContactDaysAgo: 16 },
  { id: "M022", name: "AquaPure Wellness", category: "Beauty", plan: "Standard", accountAgeMonths: 13, monthlyRevenue: 70000, ordersLast30Days: 82, daysSinceLastLogin: 9, supportTickets: 2, npsScore: 7, assignedRep: "Neha Kapoor", lastContactDaysAgo: 11 },
  { id: "M023", name: "Metro Pharmacy", category: "Health", plan: "Enterprise", accountAgeMonths: 32, monthlyRevenue: 520000, ordersLast30Days: 310, daysSinceLastLogin: 1, supportTickets: 0, npsScore: 9, assignedRep: "Priya Sharma", lastContactDaysAgo: 2 },
  { id: "M024", name: "Spice Route", category: "Food & Beverage", plan: "Standard", accountAgeMonths: 6, monthlyRevenue: 31000, ordersLast30Days: 22, daysSinceLastLogin: 19, supportTickets: 3, npsScore: 5, assignedRep: "Arjun Mehta", lastContactDaysAgo: 20 },
  { id: "M025", name: "Canvas & Co", category: "Crafts", plan: "Premium", accountAgeMonths: 15, monthlyRevenue: 88000, ordersLast30Days: 95, daysSinceLastLogin: 4, supportTickets: 1, npsScore: 8, assignedRep: "Rahul Verma", lastContactDaysAgo: 5 },
  { id: "M026", name: "Swift Logistics Hub", category: "General", plan: "Enterprise", accountAgeMonths: 21, monthlyRevenue: 290000, ordersLast30Days: 175, daysSinceLastLogin: 2, supportTickets: 2, npsScore: 8, assignedRep: "Neha Kapoor", lastContactDaysAgo: 3 },
  { id: "M027", name: "Zen Yoga Studio", category: "Health", plan: "Basic", accountAgeMonths: 4, monthlyRevenue: 11000, ordersLast30Days: 28, daysSinceLastLogin: 25, supportTickets: 2, npsScore: 6, assignedRep: "Rahul Verma", lastContactDaysAgo: 26 },
  { id: "M028", name: "Pixel Print Shop", category: "General", plan: "Standard", accountAgeMonths: 9, monthlyRevenue: 47000, ordersLast30Days: 58, daysSinceLastLogin: 5, supportTickets: 1, npsScore: 7, assignedRep: "Arjun Mehta", lastContactDaysAgo: 6 },
]
