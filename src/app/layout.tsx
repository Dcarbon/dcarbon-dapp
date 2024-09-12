import { META_DATA_DEFAULT } from '@/utils/constants/seo';
import { cn } from '@/utils/helpers/common';

import '@styles/globals.css';

import { Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Lexend as FontSans } from 'next/font/google';

const WebVitals = dynamic(() => import('@/components/features/web-vitals'), {
  ssr: false,
});

const Footer = dynamic(() => import('@/components/common/footer'));
const Header = dynamic(() => import('@/components/common/header'), {
  ssr: false,
});
const Ribbon = dynamic(() => import('@/components/features/ribbon'), {
  ssr: false,
});

const GlobalStoreProvider = dynamic(() => import('./global-store-provider'), {
  ssr: false,
});
const NextuiProviders = dynamic(() => import('./nextui-provider'), {
  ssr: false,
});
const SolanaWalletProvider = dynamic(
  () => import('./solana-wallets-provider'),
  { ssr: false },
);
const SWRProvider = dynamic(() => import('./swr-provider'), { ssr: false });

const SonnerToaster = dynamic(
  () => import('@/components/common/toast/sonner'),
  { ssr: false },
);

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const metadata = META_DATA_DEFAULT;

const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = (props: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="scroll-smooth scrollbar relative">
      <body
        className={cn(
          'min-h-screen font-sans antialiased text-text-primary overflow-x-hidden',
          fontSans.variable,
        )}
      >
        <WebVitals />
        {import('nextjs-toploader').then((NextTopLoader) => {
          return <NextTopLoader.default color="#7BDA08" />;
        })}
        <NextuiProviders>
          <SWRProvider>
            <SolanaWalletProvider>
              <GlobalStoreProvider>
                <Header />
                {props?.children}
                <Footer />
              </GlobalStoreProvider>
            </SolanaWalletProvider>
          </SWRProvider>
        </NextuiProviders>
        <SonnerToaster position="top-right" />
        <Ribbon />
      </body>
    </html>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default RootLayout;

// eslint-disable-next-line import/no-unused-modules
export { metadata, viewport };
