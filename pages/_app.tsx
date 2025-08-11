import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

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
    <>
      <Component {...pageProps} />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        duration={3000}
      />
    </>
  );
}

export default appWithTranslation(App);