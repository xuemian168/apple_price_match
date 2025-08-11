import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Smooth page transition variants
const pageVariants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
};

// Content animation variants
const contentVariants = {
  initial: { opacity: 0, y: 10 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, delay: 0.1 }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter();

  return (
    <AnimatePresence 
      mode="wait" 
      initial={false}
      onExitComplete={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <motion.div
        key={router.asPath}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
      >
        <motion.div variants={contentVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Enhanced layout wrapper with better performance
export function OptimizedLayout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}