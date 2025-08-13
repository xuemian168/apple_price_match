// Core types for the Apple Price Match application

export interface Country {
  code: string; // ISO country code (e.g., 'US', 'CN', 'JP')
  name: string;
  currency: string; // ISO currency code (e.g., 'USD', 'CNY', 'JPY')
  flag: string; // Emoji flag or flag URL
}

export interface Currency {
  code: string; // ISO currency code
  name: string;
  symbol: string;
  rate?: number; // Exchange rate to USD
}

export interface iCloudPlan {
  id: string;
  storage: string; // e.g., '5GB', '50GB', '200GB', '2TB'
  storageBytes: number; // Storage in bytes for comparison
  isFree: boolean;
  supportsFamilySharing?: boolean; // Whether this plan supports Apple Family Sharing (200GB+)
}

export interface iCloudPricing {
  country: string; // Country code
  currency: string; // Currency code
  plan: string; // Plan ID
  priceMonthly: number;
  priceYearly?: number;
  originalCurrency: string;
  originalPriceMonthly: number;
  originalPriceYearly?: number;
  lastUpdated: string; // ISO date string
}

export interface DeviceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  category: string; // Category ID
  baseModel: string; // Base model name
  specifications: Record<string, any>;
}

export interface DevicePricing {
  country: string; // Country code
  currency: string; // Currency code
  deviceId: string;
  configuration: Record<string, any>; // Device configuration (storage, color, etc.)
  price: number;
  originalCurrency: string;
  originalPrice: number;
  lastUpdated: string; // ISO date string
}

export interface ExchangeRate {
  from: string; // Currency code
  to: string; // Currency code
  rate: number;
  lastUpdated: string; // ISO date string
}

export interface ComparisonSettings {
  selectedCountries: string[]; // Country codes
  targetCurrency: string; // Currency code
  showOriginalPrices: boolean;
  sortBy: 'price' | 'country' | 'currency';
  sortOrder: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  warning?: string;
  timestamp: string;
}

export interface PricingComparisonResult {
  plan?: iCloudPlan;
  device?: DeviceModel;
  pricing: (iCloudPricing | DevicePricing)[];
  exchangeRates: Record<string, number>;
  lastUpdated: string;
}

// Family Sharing / Car-pooling types
export interface SharingCalculation {
  memberCount: number;
  pricePerPerson: number;
  annualSavingsPerPerson: number;
  totalSavings: number;
}

export interface SharingData {
  plan: iCloudPlan;
  originalMonthlyPrice: number;
  targetCurrency: string;
  calculations: SharingCalculation[]; // For different member counts (2-6)
}

// Apple Music types
export interface AppleMusicPlan {
  id: string;
  name: string; // e.g., 'Individual', 'Family', 'Student'
  maxUsers: number; // 1 for individual, 6 for family, 1 for student
  features: string[]; // List of features
  isStudentPlan: boolean;
  supportsFamilySharing: boolean;
}

export interface AppleMusicPricing {
  country: string; // Country code
  currency: string; // Currency code
  plan: string; // Plan ID
  priceMonthly: number;
  priceYearly?: number;
  originalCurrency: string;
  originalPriceMonthly: number;
  originalPriceYearly?: number;
  lastUpdated: string; // ISO date string
  studentDiscountAvailable?: boolean;
  freeTrial?: {
    duration: number; // Days
    available: boolean;
  };
}