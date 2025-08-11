import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Navigation cache management
class NavigationCache {
  private static instance: NavigationCache;
  private cache: Map<string, any> = new Map();
  private prefetchQueue: Set<string> = new Set();

  static getInstance(): NavigationCache {
    if (!NavigationCache.instance) {
      NavigationCache.instance = new NavigationCache();
    }
    return NavigationCache.instance;
  }

  // Cache page data
  cachePageData(route: string, data: any) {
    this.cache.set(route, {
      data,
      timestamp: Date.now(),
      accessed: Date.now()
    });
  }

  // Get cached page data
  getCachedPageData(route: string) {
    const cached = this.cache.get(route);
    if (cached) {
      cached.accessed = Date.now();
      return cached.data;
    }
    return null;
  }

  // Add route to prefetch queue
  addToPrefetchQueue(route: string) {
    this.prefetchQueue.add(route);
  }

  // Get prefetch queue
  getPrefetchQueue(): string[] {
    return Array.from(this.prefetchQueue);
  }

  // Clear old cache entries
  cleanup() {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    this.cache.forEach((cached, route) => {
      if (now - cached.accessed > maxAge) {
        this.cache.delete(route);
      }
    });
  }
}

// Hook for navigation optimization
export function useNavigationOptimizer() {
  const router = useRouter();
  const cache = NavigationCache.getInstance();
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Cleanup cache periodically
    const cleanup = setInterval(() => {
      cache.cleanup();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(cleanup);
  }, [cache]);

  useEffect(() => {
    // Prefetch critical routes on mount
    const criticalRoutes = ['/', '/icloud', '/devices', '/about'];
    
    const prefetchRoutes = async () => {
      for (const route of criticalRoutes) {
        if (route !== router.pathname) {
          try {
            await router.prefetch(route);
            cache.addToPrefetchQueue(route);
          } catch (error) {
            console.warn(`Failed to prefetch ${route}:`, error);
          }
        }
      }
      setIsOptimized(true);
    };

    // Delay prefetching to avoid blocking initial render
    const timer = setTimeout(prefetchRoutes, 100);
    return () => clearTimeout(timer);
  }, [router, cache]);

  // Intelligent prefetching on hover
  const prefetchOnHover = (route: string) => {
    if (!cache.getPrefetchQueue().includes(route)) {
      router.prefetch(route);
      cache.addToPrefetchQueue(route);
    }
  };

  return {
    isOptimized,
    prefetchOnHover,
    cache,
  };
}

// Navigation performance monitor
export function useNavigationPerformance() {
  const router = useRouter();
  const [navigationMetrics, setNavigationMetrics] = useState({
    startTime: 0,
    endTime: 0,
    duration: 0,
    route: '',
  });

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setNavigationMetrics(prev => ({
        ...prev,
        startTime: performance.now(),
        route: url,
      }));
    };

    const handleRouteChangeComplete = (url: string) => {
      const endTime = performance.now();
      setNavigationMetrics(prev => ({
        ...prev,
        endTime,
        duration: endTime - prev.startTime,
      }));

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Navigation to ${url} took ${endTime - navigationMetrics.startTime}ms`);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router, navigationMetrics.startTime]);

  return navigationMetrics;
}

// Component for critical resource preloading
export function NavigationPreloader() {
  const { isOptimized } = useNavigationOptimizer();
  const metrics = useNavigationPerformance();

  useEffect(() => {
    // Preload critical stylesheets and scripts
    const preloadResources = () => {
      // Preload fonts
      const fontLinks = [
        '/fonts/inter-var.woff2',
        '/fonts/inter-var-italic.woff2',
      ];

      fontLinks.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = font;
        document.head.appendChild(link);
      });

      // Preload critical images
      const criticalImages = [
        '/icons/apple-touch-icon.png',
        '/og-image.png',
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    if (isOptimized) {
      preloadResources();
    }
  }, [isOptimized]);

  // Don't render anything - this is a utility component
  return null;
}

// Hook for optimized navigation with loading states
export function useOptimizedNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  const navigateOptimized = async (url: string, options?: any) => {
    if (isNavigating) return;

    setIsNavigating(true);
    setNavigationError(null);

    try {
      // Add loading state
      await router.push(url, undefined, {
        shallow: false,
        scroll: true,
        ...options,
      });
    } catch (error) {
      console.error('Navigation error:', error);
      setNavigationError(error instanceof Error ? error.message : 'Navigation failed');
    } finally {
      setIsNavigating(false);
    }
  };

  return {
    navigateOptimized,
    isNavigating,
    navigationError,
  };
}