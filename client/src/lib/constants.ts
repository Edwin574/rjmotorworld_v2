// Currency formatting
export const CURRENCY = {
  code: 'KES',
  symbol: 'KSh',
  name: 'Kenyan Shilling',
  locale: 'en-KE',
  formatter: (value: number) => `KSh ${value.toLocaleString('en-KE')}`
};

// Car brands with logo URLs
export const CAR_BRANDS = [
  { id: 1, name: "BMW", logoUrl: "https://www.carlogos.org/car-logos/bmw-logo.png" },
  { id: 2, name: "Mercedes-Benz", logoUrl: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
  { id: 3, name: "Toyota", logoUrl: "https://www.carlogos.org/car-logos/toyota-logo.png" },
  { id: 4, name: "Audi", logoUrl: "https://www.carlogos.org/car-logos/audi-logo.png" },
  { id: 5, name: "Honda", logoUrl: "https://www.carlogos.org/car-logos/honda-logo.png" },
  { id: 6, name: "Ford", logoUrl: "https://www.carlogos.org/car-logos/ford-logo.png" },
  { id: 7, name: "Volkswagen", logoUrl: "https://www.carlogos.org/car-logos/volkswagen-logo.png" },
  { id: 8, name: "Nissan", logoUrl: "https://www.carlogos.org/car-logos/nissan-logo.png" },
  { id: 9, name: "Subaru", logoUrl: "https://www.carlogos.org/car-logos/subaru-logo.png" },
  { id: 10, name: "Mazda", logoUrl: "https://www.carlogos.org/car-logos/mazda-logo.png" }
];

// Price ranges for filtering (in Kenyan Shillings)
export const PRICE_RANGES = [
  { min: undefined, max: 1000000, label: "Under KSh 1,000,000" },
  { min: 1000000, max: 2000000, label: "KSh 1,000,000 - KSh 2,000,000" },
  { min: 2000000, max: 3000000, label: "KSh 2,000,000 - KSh 3,000,000" },
  { min: 3000000, max: 4000000, label: "KSh 3,000,000 - KSh 4,000,000" },
  { min: 4000000, max: 5000000, label: "KSh 4,000,000 - KSh 5,000,000" },
  { min: 5000000, max: 7500000, label: "KSh 5,000,000 - KSh 7,500,000" },
  { min: 7500000, max: 10000000, label: "KSh 7,500,000 - KSh 10,000,000" },
  { min: 10000000, max: undefined, label: "Over KSh 10,000,000" }
];

// Mileage ranges for filtering (in kilometers)
export const MILEAGE_RANGES = [
  { min: undefined, max: 10000, label: "Under 10,000 km" },
  { min: 10000, max: 20000, label: "10,000 - 20,000 km" },
  { min: 20000, max: 50000, label: "20,000 - 50,000 km" },
  { min: 50000, max: 80000, label: "50,000 - 80,000 km" },
  { min: 80000, max: 100000, label: "80,000 - 100,000 km" },
  { min: 100000, max: 150000, label: "100,000 - 150,000 km" },
  { min: 150000, max: undefined, label: "Over 150,000 km" }
];

// Year ranges for filtering
export const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

// Contact time options
export const CONTACT_TIMES = [
  { value: "morning", label: "Morning (9AM - 12PM)" },
  { value: "afternoon", label: "Afternoon (12PM - 5PM)" },
  { value: "evening", label: "Evening (5PM - 8PM)" }
];

// Contact method options
export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" }
];

// Accident history options
export const ACCIDENT_HISTORY = [
  { value: "no_accidents", label: "No Accidents" },
  { value: "minor_accidents", label: "Minor Accidents" },
  { value: "major_accidents", label: "Major Accidents" }
];

// Seller type options
export const SELLER_TYPES = [
  { 
    value: "individual", 
    label: "Individual", 
    icon: "user",
    description: "I am a private car owner"
  },
  { 
    value: "corporate", 
    label: "Corporate", 
    icon: "building",
    description: "I represent a company"
  },
  { 
    value: "showroom", 
    label: "Showroom", 
    icon: "store",
    description: "I have a car dealership"
  }
];

// Business hours
export const BUSINESS_HOURS = {
  weekdays: "Monday - Friday: 8:30 AM - 6:30 PM",
  saturday: "Saturday: 9:00 AM - 5:00 PM",
  sunday: "Sunday: By appointment only"
};

// Contact information
export const CONTACT_INFO = {
  address: "Mombasa Road, Nairobi, Kenya",
  phone: "+254 700 123 456",
  email: "info@rjmotorworld.co.ke"
};

// Social media links
export const SOCIAL_MEDIA = {
  facebook: "https://facebook.com/rjmotorworld",
  instagram: "https://instagram.com/rjmotorworld",
  twitter: "https://twitter.com/rjmotorworld",
  whatsapp: "+254 700 123 456"
};

// Theme colors - based on the RJ Motorworld logo
export const THEME_COLORS = {
  primary: '#000000',    // Black as primary color (from logo)
  secondary: '#ffffff',  // White as secondary color (from logo)
  accent: '#e63946',     // Accent color for buttons and highlights
  dark: '#111827',
  grayMedium: '#374151',
  grayLight: '#9ca3af',
  offWhite: '#f3f4f6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b'
};
