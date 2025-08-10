import React from 'react';
import { useTranslation } from 'next-i18next';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries, getCountryByCode } from '@/data/countries';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function CountrySelector({ 
  selectedCountries, 
  onSelectionChange,
  multiple = true,
  className 
}: CountrySelectorProps) {
  const { t } = useTranslation('common');

  const handleCountryToggle = (countryCode: string) => {
    if (multiple) {
      const newSelection = selectedCountries.includes(countryCode)
        ? selectedCountries.filter(c => c !== countryCode)
        : [...selectedCountries, countryCode];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([countryCode]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCountries.length === countries.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(countries.map(c => c.code));
    }
  };

  if (!multiple) {
    return (
      <Select 
        value={selectedCountries[0] || ''} 
        onValueChange={(value) => onSelectionChange([value])}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={t('country.select')}>
            {selectedCountries[0] && (
              <div className="flex items-center gap-2">
                <span>{getCountryByCode(selectedCountries[0])?.flag}</span>
                <span>{getCountryByCode(selectedCountries[0])?.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <span className="text-muted-foreground">({country.currency})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="border rounded-md p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {t('country.select')} ({selectedCountries.length}/{countries.length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs"
          >
            {selectedCountries.length === countries.length ? 'Clear All' : t('country.all')}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {countries.map((country) => (
            <div
              key={country.code}
              className={cn(
                "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted text-sm",
                selectedCountries.includes(country.code) && "bg-primary/10"
              )}
              onClick={() => handleCountryToggle(country.code)}
            >
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <span className="text-xs">{country.flag}</span>
                <span className="truncate">{country.name}</span>
              </div>
              {selectedCountries.includes(country.code) && (
                <Check className="h-3 w-3 text-primary flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}