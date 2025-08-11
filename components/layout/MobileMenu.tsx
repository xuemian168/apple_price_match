import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, X, Home, Cloud, Smartphone, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    close(); // Close menu first
    await router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          
          {/* Side Menu */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-xl"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Apple className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">ICT.RUN</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="py-4">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                const IconComponent = item.icon;
                
                return (
                  <button
                    key={item.href}
                    className={cn(
                      "w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors",
                      isActive 
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
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
    <Button
      variant="ghost"
      size="sm"
      className="md:hidden h-10 w-10 p-0"
      onClick={toggle}
      aria-label={isOpen ? "关闭菜单" : "打开菜单"}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );
}