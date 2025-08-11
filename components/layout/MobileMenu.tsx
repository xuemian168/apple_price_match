import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, X, Home, Cloud, Smartphone, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LiquidGlass from 'liquid-glass-react';

// Mobile Menu Context
interface MobileMenuContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider');
  }
  return context;
};

// Mobile Menu Provider Component
interface MobileMenuProviderProps {
  children: React.ReactNode;
}

export function MobileMenuProvider({ children }: MobileMenuProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <MobileMenuContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
      <MobileMenuOverlay />
    </MobileMenuContext.Provider>
  );
}

// Mobile Menu Overlay Component
function MobileMenuOverlay() {
  const { isOpen, close } = useMobileMenu();
  const { t } = useTranslation('common');
  const router = useRouter();

  const navItems = [
    { 
      href: '/', 
      label: t('navigation.home'), 
      icon: Home,
      gradient: 'from-blue-500 to-cyan-500',
      description: '首页概览'
    },
    { 
      href: '/icloud', 
      label: t('navigation.icloud'), 
      icon: Cloud,
      gradient: 'from-purple-500 to-pink-500',
      description: 'iCloud存储对比'
    },
    { 
      href: '/devices', 
      label: t('navigation.devices'), 
      icon: Smartphone,
      gradient: 'from-orange-500 to-red-500',
      description: '设备价格对比'
    },
    { 
      href: '/about', 
      label: t('navigation.about'), 
      icon: Info,
      gradient: 'from-green-500 to-teal-500',
      description: '关于我们'
    },
  ];

  const handleNavigation = async (href: string) => {
    // Use smooth client-side navigation
    await router.push(href);
    // Don't close menu - let it persist
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
          
          {/* Menu container */}
          <motion.div
            className="absolute inset-x-4 top-20 bottom-safe"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30 
            }}
          >
            <LiquidGlass
              blur={25}
              saturation={1.4}
              chromaticAberration={3}
              elasticity={0.5}
              cornerRadius={24}
              className="h-full rounded-3xl"
            >
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/30 h-full overflow-hidden">
              
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Apple className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">导航菜单</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">选择您要访问的页面</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  onClick={close}
                >
                  <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="p-6 space-y-3 flex-1 overflow-y-auto">
                {navItems.map((item, index) => {
                  const isActive = router.pathname === item.href;
                  const IconComponent = item.icon;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <motion.button
                        className={cn(
                          "w-full text-left relative overflow-hidden rounded-2xl p-4 transition-all duration-300",
                          isActive 
                            ? "bg-gradient-to-r shadow-lg scale-[1.02]" 
                            : "bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-md hover:scale-[1.01]"
                        )}
                        style={isActive ? { backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` } : {}}
                        onClick={() => handleNavigation(item.href)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Active item background gradient */}
                        {isActive && (
                          <div className={cn("absolute inset-0 bg-gradient-to-r opacity-20", item.gradient)} />
                        )}
                        
                        <div className="relative flex items-center space-x-4">
                          {/* Icon with gradient background */}
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300",
                            isActive 
                              ? "bg-white/90 text-slate-800" 
                              : `bg-gradient-to-br ${item.gradient} text-white`
                          )}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          
                          {/* Text content */}
                          <div className="flex-1">
                            <div className={cn(
                              "font-semibold text-base transition-colors",
                              isActive 
                                ? "text-slate-900 dark:text-white" 
                                : "text-slate-800 dark:text-slate-200"
                            )}>
                              {item.label}
                            </div>
                            <div className={cn(
                              "text-sm transition-colors",
                              isActive 
                                ? "text-slate-700 dark:text-slate-300" 
                                : "text-slate-500 dark:text-slate-400"
                            )}>
                              {item.description}
                            </div>
                          </div>
                          
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              className="w-3 h-3 bg-white rounded-full shadow-sm"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </div>
                        
                        {/* Shine effect for active item */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Menu Footer */}
              <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>菜单保持开启</span>
                  </div>
                  <span>•</span>
                  <span>点击外部或按 ESC 关闭</span>
                </div>
              </div>
              </div>
            </LiquidGlass>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Mobile Menu Button Component
export function MobileMenuButton() {
  const { isOpen, toggle } = useMobileMenu();

  return (
    <motion.div
      className="md:hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="relative bg-white/50 dark:bg-slate-800/60 backdrop-blur-md border border-white/30 dark:border-slate-600/40 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full w-10 h-10 p-0"
        aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        onClick={toggle}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Menu icon with animated bars */}
              <div className="flex flex-col space-y-1">
                <motion.div 
                  className="w-4 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full"
                  animate={{ scaleX: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-4 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full"
                  animate={{ scaleX: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.div 
                  className="w-4 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full"
                  animate={{ scaleX: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}