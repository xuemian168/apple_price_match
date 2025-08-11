import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { Cloud, Database, HardDrive } from 'lucide-react';
import { iCloudPlan } from '@/types';

interface AnimatedStorageSelectorProps {
  plans: iCloudPlan[];
  selectedPlan: string;
  onPlanChange: (planId: string) => void;
  className?: string;
}

const storageIcons = {
  '50gb': Cloud,
  '200gb': Database,
  '2tb': HardDrive,
  '6tb': HardDrive,
  '12tb': HardDrive,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function AnimatedStorageSelector({
  plans,
  selectedPlan,
  onPlanChange,
  className = "",
}: AnimatedStorageSelectorProps) {
  const { t } = useTranslation('common');

  const handlePlanChange = useCallback((planId: string) => {
    onPlanChange(planId);
  }, [onPlanChange]);

  const getStorageColor = (planId: string) => {
    const colors = {
      '50gb': 'from-blue-500 to-blue-600',
      '200gb': 'from-green-500 to-green-600', 
      '2tb': 'from-purple-500 to-purple-600',
      '6tb': 'from-orange-500 to-orange-600',
      '12tb': 'from-red-500 to-red-600',
    };
    return colors[planId as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getStorageSize = (storage: string) => {
    const sizeMap = {
      '50GB': { value: 50, unit: 'GB' },
      '200GB': { value: 200, unit: 'GB' },
      '2TB': { value: 2, unit: 'TB' },
      '6TB': { value: 6, unit: 'TB' },
      '12TB': { value: 12, unit: 'TB' },
    };
    return sizeMap[storage as keyof typeof sizeMap] || { value: 0, unit: 'GB' };
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium flex items-center gap-2">
        <Database className="h-4 w-4" />
        {t('icloud.features.storage')}
      </label>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {plans.map((plan) => {
          const Icon = storageIcons[plan.id as keyof typeof storageIcons] || Cloud;
          const isSelected = selectedPlan === plan.id;
          const { value, unit } = getStorageSize(plan.storage);
          
          return (
            <div
              key={plan.id}
              className="relative"
            >
              <button
                onClick={() => handlePlanChange(plan.id)}
                className={`
                  relative w-full p-4 rounded-xl border-2 transition-colors duration-100
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/25' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                  group overflow-hidden
                `}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getStorageColor(plan.id)} opacity-0 group-hover:opacity-10`}
                />
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
                )}
                
                <div className="relative z-10 text-center space-y-2">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  
                  {/* Storage value */}
                  <div className="space-y-1">
                    <div className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {value}
                      <span className="text-sm ml-0.5">{unit}</span>
                    </div>
                    
                    {/* Simple underline */}
                    <div
                      className={`h-0.5 mx-auto bg-gradient-to-r ${getStorageColor(plan.id)} rounded-full ${
                        isSelected ? "w-full" : "w-0" 
                      }`}
                    />
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </motion.div>
      
      {/* Selected plan info */}
      {selectedPlan && (
        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>Selected: </span>
            <span className="font-medium text-primary">
              {plans.find(p => p.id === selectedPlan)?.storage} Storage Plan
            </span>
          </div>
        </div>
      )}
    </div>
  );
}