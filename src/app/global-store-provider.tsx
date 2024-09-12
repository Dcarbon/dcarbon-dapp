'use client';

import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createGlobalStore, GlobalStore } from '@/stores/global.store';
import { WEB_ROUTES } from '@/utils/constants';
// import * as Sentry from '@sentry/nextjs';
import { useLocalStorage, useWallet } from '@solana/wallet-adapter-react';
// import { env } from 'env.mjs';
import { useStore } from 'zustand';

type GlobalStoreApi = ReturnType<typeof createGlobalStore>;
const GlobalStoreContext = createContext<GlobalStoreApi | null>(null);

interface GlobalStoreProviderProps {
  children: ReactNode;
}

const GlobalStoreProvider = ({ children }: GlobalStoreProviderProps) => {
  const storeRef = useRef<GlobalStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createGlobalStore();
  }

  const [walletName] = useLocalStorage('walletName', '');
  const { connected, wallet } = useWallet();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const autoRedirect = () => {
      router.replace(WEB_ROUTES.HOME);
    };

    if (connected) {
      return;
    }

    if (!walletName && pathName === WEB_ROUTES.PROFILE) {
      autoRedirect();
    }

    wallet?.adapter.once('disconnect', autoRedirect);
  }, [connected, pathName, router, wallet?.adapter, walletName]);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'production') {
  //     Sentry.init({
  //       dsn: env.NEXT_PUBLIC_SENTRY_DSN,

  //       // Adjust this value in production, or use tracesSampler for greater control
  //       tracesSampleRate: 1,

  //       // Setting this option to true will print useful information to the console while you're setting up Sentry.
  //       debug: false,

  //       replaysOnErrorSampleRate: 1.0,

  //       // This sets the sample rate to be 10%. You may want this to be 100% while
  //       // in development and sample at a lower rate in production
  //       replaysSessionSampleRate: 0.1,

  //       // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  //       integrations: [
  //         Sentry.replayIntegration({
  //           // Additional Replay configuration goes in here, for example:
  //           maskAllText: true,
  //           blockAllMedia: true,
  //         }),
  //         Sentry.captureConsoleIntegration({
  //           levels: ['error', 'debug'],
  //         }),
  //       ],
  //     });
  //   }
  // }, []);

  function matchMode(e: MediaQueryListEvent) {
    if (!storeRef.current) return;
    storeRef.current.setState({
      theme: e.matches ? 'dark' : 'light',
    });
  }

  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', matchMode);
    }

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const userTheme = localStorage.getItem('theme') as GlobalStore['theme'];

    storeRef.current?.setState({ theme: userTheme || systemTheme });
  }, []);

  if (pathName === WEB_ROUTES.PROFILE && !connected) {
    return null;
  }

  return (
    <GlobalStoreContext.Provider value={storeRef.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`globalStore must be use within GlobalStoreProvider`);
  }

  return useStore(globalStoreContext, selector);
};

export default GlobalStoreProvider;

export { useGlobalStore };
