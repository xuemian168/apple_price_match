import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { MobileMenuProvider } from '@/components/layout/MobileMenu';
import { DesktopNavigationProvider, NavigationProgressBar, useNavigationPreload } from '@/components/layout/DesktopNavigation';
import { NavigationPreloader } from '@/components/layout/NavigationOptimizer';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';

// App content wrapper component
function AppContent({ Component, pageProps }: { Component: any, pageProps: any }) {
  useNavigationPreload(); // Preload navigation routes

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="relative flex min-h-screen flex-col">
        {/* Persistent Header - never reloads */}
        <Header />
        
        {/* Main content with proper spacing for fixed header */}
        <main className="flex-1 pt-16">
          <PageTransition>
            <Component {...pageProps} />
          </PageTransition>
        </main>
        
        {/* Persistent Footer */}
        <Footer />
      </div>
    </div>
  );
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // 检测是否为微信浏览器
    const isWeChat = () => {
      if (typeof window === 'undefined') return false;
      const ua = window.navigator.userAgent.toLowerCase();
      return ua.includes('micromessenger');
    };

    // 如果是微信浏览器且当前语言不是中文，则切换到中文
    if (isWeChat() && router.locale !== 'zh') {
      router.push(router.asPath, router.asPath, { locale: 'zh' });
    }
  }, [router]);

  return (
    <DesktopNavigationProvider>
      <MobileMenuProvider>
        <NavigationPreloader />
        <NavigationProgressBar />
        <AppContent Component={Component} pageProps={pageProps} />
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          duration={3000}
        />
      </MobileMenuProvider>
    </DesktopNavigationProvider>
  );
}

export default appWithTranslation(App);