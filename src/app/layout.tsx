import WebVitals from '@/components/features/web-vitals';
import { META_DATA_DEFAULT } from '@/utils/constants/seo';
import { cn } from '@/utils/helpers/common';

import '@styles/globals.css';

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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="scroll-smooth snap-y scrollbar">
      <body
        className={cn(
          'min-h-screen font-sans antialiased text-text-primary overflow-x-hidden',
          fontSans.variable,
        )}
      >
        <WebVitals />
        <NextTopLoader />
        <NextuiProviders>
          <SolanaWalletProvider>
            <Header />
            {children}
            <Footer />
          </SolanaWalletProvider>
        </NextuiProviders>
        <SonnerToaster />
      </body>
    </html>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default RootLayout;

export { metadata };
