# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apple Price Match is a Next.js-based web application for comparing Apple iCloud and device prices across different countries. The application supports multiple languages (i18n) and provides real-time currency conversion for accurate price comparisons.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Internationalization**: next-i18next
- **State Management**: React hooks + custom hooks
- **API**: Next.js API routes

### Directory Structure
```
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── layout/         # Layout components (Header, Footer, Layout)
│   ├── pricing/        # Pricing comparison components
│   ├── currency/       # Currency-related components
│   └── country/        # Country selection components
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   ├── index.tsx      # Home page
│   ├── icloud.tsx     # iCloud pricing comparison
│   ├── devices.tsx    # Device pricing (placeholder)
│   └── about.tsx      # About page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
├── data/               # Static data and sample data
├── styles/             # Global styles
└── public/locales/     # i18n translation files
```

### Key Components

#### Pricing Components
- `iCloudComparison`: Main iCloud pricing comparison interface
- `iCloudPricingTable`: Table displaying price comparisons
- `DevicePlaceholder`: Placeholder for future device pricing feature

#### UI Components
- `CurrencySelector`: Dropdown for selecting target currency
- `CountrySelector`: Multi-select component for choosing countries
- Layout components with responsive navigation

#### Data Management
- `useExchangeRates`: Hook for fetching and managing exchange rates
- `useiCloudPricing`: Hook for fetching iCloud pricing data
- Sample data files for countries, currencies, and pricing

### API Endpoints

#### `/api/exchange-rates`
- **Method**: GET
- **Description**: Returns current exchange rates for supported currencies
- **Response**: Array of exchange rate objects with USD as base currency

#### `/api/icloud-pricing`
- **Method**: GET
- **Query Parameters**:
  - `plan`: iCloud plan ID (required)
  - `countries`: Comma-separated country codes (optional)
  - `currency`: Target currency code (optional, defaults to USD)
- **Description**: Returns pricing data for specified iCloud plan
- **Response**: Pricing comparison result with converted prices

### Internationalization (i18n)

The application supports multiple languages through next-i18next:
- **Supported Languages**: English (en), Chinese (zh), Japanese (ja), Korean (ko), Spanish (es), French (fr), German (de)
- **Translation files**: Located in `public/locales/{locale}/common.json`
- **Configuration**: `next-i18next.config.js`

### Data Models

#### Core Types
- `Country`: Country information with currency and flag
- `Currency`: Currency data with symbols and names
- `iCloudPlan`: iCloud storage plan specifications
- `iCloudPricing`: Pricing data for iCloud plans by country
- `ExchangeRate`: Currency exchange rate information

### Development Notes

#### Adding New Countries
1. Add country data to `data/countries.ts`
2. Add currency data to `data/currencies.ts` if new currency
3. Update sample pricing data in `data/sample-icloud-pricing.ts`
4. Update exchange rates in API endpoints

#### Adding New Languages
1. Create new locale folder in `public/locales/{locale}/`
2. Add translation file `common.json`
3. Update `next-i18next.config.js` locales array
4. Add language option to Header component

#### Extending Device Pricing
1. Create device-specific data models in `types/`
2. Add device data files in `data/`
3. Create device pricing API endpoints
4. Replace `DevicePlaceholder` with actual device components
5. Add device-specific hooks in `hooks/`

### Current Limitations

- Exchange rates use mock data (need real API integration)
- iCloud pricing uses sample data (need real pricing data source)
- Device pricing is placeholder only
- No price history tracking yet
- No user preferences persistence

### Future Enhancements

- Real-time data integration with Apple stores
- Price history and trend analysis
- User accounts and preferences
- Price alerts and notifications
- Advanced filtering and sorting options
- Export functionality for comparison data