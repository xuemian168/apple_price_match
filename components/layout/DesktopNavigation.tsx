import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Home, Cloud, Smartphone, Info } from 'lucide-react';
import { useNavigationOptimizer, useOptimizedNavigation } from './NavigationOptimizer';
import { cn } from '@/lib/utils';
import LiquidGlass from 'liquid-glass-react';

// Desktop Navigation Context
interface DesktopNavigationContextType {
  activeRoute: string;
  isNavigating: boolean;
  navigateTo: (href: string) => Promise<void>;
}

const DesktopNavigationContext = createContext<DesktopNavigationContextType | undefined>(undefined);

export const useDesktopNavigation = () => {
  const context = useContext(DesktopNavigationContext);
  if (!context) {
    throw new Error('useDesktopNavigation must be used within DesktopNavigationProvider');
  }
  return context;
};

// Desktop Navigation Provider
interface DesktopNavigationProviderProps {
  children: React.ReactNode;
}

export function DesktopNavigationProvider({ children }: DesktopNavigationProviderProps) {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState(router.pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  // Update active route when router changes
  useEffect(() => {
    setActiveRoute(router.pathname);
  }, [router.pathname]);

  const navigateTo = useCallback(async (href: string) => {
    if (href === activeRoute || isNavigating) return;
    
    setIsNavigating(true);
    try {
      // Use shallow routing for better performance
      await router.push(href, undefined, { shallow: false });
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(false);
    }
  }, [router, activeRoute, isNavigating]);

  return (
    <DesktopNavigationContext.Provider value={{ activeRoute, isNavigating, navigateTo }}>
      {children}
    </DesktopNavigationContext.Provider>
  );
}

// Navigation Item Interface
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// Desktop Navigation Component
export function DesktopNavigation() {
  const { t } = useTranslation('common');
  const { activeRoute, isNavigating, navigateTo } = useDesktopNavigation();
  const { prefetchOnHover } = useNavigationOptimizer();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { 
      href: '/', 
      label: t('navigation.home'), 
      icon: Home,
      description: '首页概览'
    },
    { 
      href: '/icloud', 
      label: t('navigation.icloud'), 
      icon: Cloud,
      description: 'iCloud存储对比'
    },
    { 
      href: '/devices', 
      label: t('navigation.devices'), 
      icon: Smartphone,
      description: '设备价格对比'
    },
    { 
      href: '/about', 
      label: t('navigation.about'), 
      icon: Info,
      description: '关于我们'
    },
  ];

  const handleNavigation = (href: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigateTo(href);
  };

  return (
    <nav className="hidden md:flex items-center relative">
      {/* Navigation container with enhanced glass morphism */}
      <div className="flex items-center space-x-1 bg-white/40 dark:bg-slate-800/60 backdrop-blur-md rounded-full p-1 border border-white/30 dark:border-slate-600/50 shadow-xl relative">
        
        {/* Navigation items */}
        {navItems.map((item, index) => {
          const isActive = activeRoute === item.href;
          const isHovered = hoveredItem === item.href;
          const IconComponent = item.icon;
          
          return (
            <div key={item.href} className="relative">
              {/* Active background indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 bg-white dark:bg-slate-600 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-500/50 -z-0"
                  initial={false}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    duration: 0.3
                  }}
                />
              )}
              
              <motion.button
                className={cn(
                  "relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 z-10",
                  isNavigating && activeRoute !== item.href && "opacity-50 pointer-events-none",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                )}
                onClick={(e) => handleNavigation(item.href, e)}
                onMouseEnter={() => {
                  setHoveredItem(item.href);
                  prefetchOnHover(item.href); // Prefetch on hover
                }}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                disabled={isNavigating}
              >
                {/* Icon */}
                <IconComponent className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  isActive 
                    ? "text-slate-800 dark:text-white" 
                    : "text-slate-500 dark:text-slate-300"
                )} />

                {/* Text label */}
                <span className={cn(
                  "text-sm font-semibold transition-colors duration-200 whitespace-nowrap",
                  isActive 
                    ? "text-slate-800 dark:text-white" 
                    : "text-slate-500 dark:text-slate-300"
                )}>
                  {item.label}
                </span>

              </motion.button>

              {/* Tooltip on hover */}
              {isHovered && (
                <motion.div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                    {item.description}
                    {/* Arrow */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45" />
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

      </div>
    </nav>
  );
}

// Progress Bar Component for navigation feedback
export function NavigationProgressBar() {
  const { isNavigating } = useDesktopNavigation();

  return (
    <>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0, originX: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      )}
    </>
  );
}

// Hook for navigation preloading
export function useNavigationPreload() {
  const router = useRouter();

  const preloadRoute = useCallback((href: string) => {
    router.prefetch(href);
  }, [router]);

  useEffect(() => {
    // Preload all navigation routes
    const routes = ['/', '/icloud', '/devices', '/about'];
    routes.forEach(route => {
      if (route !== router.pathname) {
        preloadRoute(route);
      }
    });
  }, [router.pathname, preloadRoute]);

  return { preloadRoute };
}