import WebVitals from '@/components/features/web-vitals';
import { META_DATA_DEFAULT } from '@/utils/constants/seo';
import { cn } from '@/utils/helpers/common';

import '@styles/globals.css';

import { Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Lexend as FontSans } from 'next/font/google';
import Footer from '@/components/common/footer';
import Header from '@/components/common/header';
import NextTopLoader from 'nextjs-toploader';

import NextuiProviders from './nextui-provider';
import SolanaWalletProvider from './solana-wallets-provider';

const SonnerToaster = dynamic(() => import('@/components/common/toast/sonner'));

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
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
        <NextTopLoader color="#7BDA08" />
        <NextuiProviders>
          <SolanaWalletProvider>
            <Header />
            {props?.children}
            <Footer />
          </SolanaWalletProvider>
        </NextuiProviders>
        <SonnerToaster position="top-right" />
      </body>
    </html>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default RootLayout;

// eslint-disable-next-line import/no-unused-modules
export { metadata, viewport };
