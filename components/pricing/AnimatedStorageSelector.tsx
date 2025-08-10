import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    }
  },
};

export function AnimatedStorageSelector({
  plans,
  selectedPlan,
  onPlanChange,
  className = "",
}: AnimatedStorageSelectorProps) {
  const { t } = useTranslation('common');

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
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Database className="h-4 w-4" />
        </motion.div>
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
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.button
                onClick={() => onPlanChange(plan.id)}
                className={`
                  relative w-full p-4 rounded-xl border-2 transition-all duration-300
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/25' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                  group overflow-hidden
                `}
                whileHover="hover"
                animate={isSelected ? "selected" : "unselected"}
              >
                {/* Background gradient animation */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${getStorageColor(plan.id)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  variants={{
                    hover: { opacity: 0.1 },
                    selected: { opacity: 0.15 }
                  }}
                />
                
                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-full h-full bg-primary rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="relative z-10 text-center space-y-2">
                  {/* Icon with animation */}
                  <motion.div
                    className="flex justify-center"
                    variants={{
                      hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.5 } },
                      selected: { scale: 1.1 }
                    }}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  
                  {/* Storage value with count-up animation */}
                  <div className="space-y-1">
                    <motion.div 
                      className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}
                      variants={{
                        selected: { scale: 1.05 }
                      }}
                    >
                      {value}
                      <span className="text-sm ml-0.5">{unit}</span>
                    </motion.div>
                    
                    {/* Animated underline */}
                    <motion.div
                      className={`h-0.5 mx-auto bg-gradient-to-r ${getStorageColor(plan.id)} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isSelected ? "100%" : "0%" 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary rounded-xl opacity-0"
                  variants={{
                    hover: { 
                      opacity: 0.3, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }
                  }}
                />
              </motion.button>
              
              {/* Selection ripple effect */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                    transition={{ duration: 0.6 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Selected plan info with slide animation */}
      <AnimatePresence mode="wait">
        {selectedPlan && (
          <motion.div
            key={selectedPlan}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/30 rounded-lg p-3 border border-border/50"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Database className="h-4 w-4" />
              </motion.div>
              <span>Selected: </span>
              <motion.span 
                className="font-medium text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {plans.find(p => p.id === selectedPlan)?.storage} Storage Plan
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}