import { Currency } from '@/types';

export const currencies: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
  },
  {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
  },
  {
    code: 'TWD',
    name: 'Taiwan Dollar',
    symbol: 'NT$',
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
  },
  {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: '$',
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
  },
  {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
  },
  {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
  },
  {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
  },
  {
    code: 'ILS',
    name: 'Israeli Shekel',
    symbol: '₪',
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: '£',
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
  },
  {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł',
  },
  {
    code: 'CZK',
    name: 'Czech Koruna',
    symbol: 'Kč',
  },
  {
    code: 'HUF',
    name: 'Hungarian Forint',
    symbol: 'Ft',
  },
  {
    code: 'RON',
    name: 'Romanian Leu',
    symbol: 'lei',
  },
  {
    code: 'BGN',
    name: 'Bulgarian Lev',
    symbol: 'лв',
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
  },
  {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
  },
  {
    code: 'COP',
    name: 'Colombian Peso',
    symbol: '$',
  },
  {
    code: 'PEN',
    name: 'Peruvian Sol',
    symbol: 'S/.',
  },
  {
    code: 'QAR',
    name: 'Qatari Riyal',
    symbol: '﷼',
  },
  {
    code: 'KZT',
    name: 'Kazakhstani Tenge',
    symbol: '₸',
  },
  {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: 'Rs',
  },
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
  },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find((currency) => currency.code === code);
};