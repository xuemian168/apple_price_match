import React from 'react';
import { cn } from '@/lib/utils';
import * as Flags from 'country-flag-icons/react/3x2';

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CountryFlag({ 
  countryCode, 
  className, 
  size = 'md'
}: CountryFlagProps) {
  const upperCode = countryCode.toUpperCase();
  
  // Get the flag component from the imported flags
  const FlagComponent = (Flags as any)[upperCode];

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-6 h-4',
    lg: 'w-8 h-6'
  };

  // Fallback when flag is not available
  if (!FlagComponent) {
    return (
      <div 
        className={cn(
          'inline-flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-mono border border-gray-300 rounded-sm',
          sizeClasses[size],
          className
        )}
        title={`Flag for ${countryCode}`}
      >
        {upperCode}
      </div>
    );
  }

  return (
    <FlagComponent 
      className={cn(
        'inline-block border border-gray-200 rounded-sm shadow-sm',
        sizeClasses[size],
        className
      )}
      title={`Flag of ${countryCode}`}
    />
  );
}