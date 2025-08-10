import React from 'react';
import { useTranslation } from 'next-i18next';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries, getCountryByCode } from '@/data/countries';
import { cn } from '@/lib/utils';
import { CountryFlag } from '@/components/ui/country-flag';

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
  const [searchQuery, setSearchQuery] = React.useState('');

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

  // Filter countries based on search query
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery.trim()) return countries;
    
    const query = searchQuery.toLowerCase().trim();
    return countries.filter((country) => 
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query) ||
      country.currency.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectAll = () => {
    if (selectedCountries.length === filteredCountries.length) {
      // If all filtered countries are selected, deselect them
      const newSelection = selectedCountries.filter(code => 
        !filteredCountries.some(country => country.code === code)
      );
      onSelectionChange(newSelection);
    } else {
      // Select all filtered countries (keep existing selections from other countries)
      const combinedSelection = [
        ...selectedCountries,
        ...filteredCountries.map(c => c.code)
      ];
      const newSelection = Array.from(new Set(combinedSelection));
      onSelectionChange(newSelection);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
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
                <CountryFlag countryCode={selectedCountries[0]} size="sm" />
                <span>{getCountryByCode(selectedCountries[0])?.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <CountryFlag countryCode={country.code} size="sm" />
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
            {selectedCountries.filter(code => filteredCountries.some(c => c.code === code)).length === filteredCountries.length ? 
              'Clear All' : 
              t('country.all')
            }
          </Button>
        </div>
        
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('country.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8 h-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Countries Grid */}
        {filteredCountries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {filteredCountries.map((country) => (
            <div
              key={country.code}
              className={cn(
                "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted text-sm",
                selectedCountries.includes(country.code) && "bg-primary/10"
              )}
              onClick={() => handleCountryToggle(country.code)}
            >
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <CountryFlag countryCode={country.code} size="sm" />
                <span className="truncate">{country.name}</span>
              </div>
              {selectedCountries.includes(country.code) && (
                <Check className="h-3 w-3 text-primary flex-shrink-0" />
              )}
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            {t('country.no_results')}
          </div>
        )}
      </div>
    </div>
  );
}