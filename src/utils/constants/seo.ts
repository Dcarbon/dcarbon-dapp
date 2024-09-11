import { Metadata } from 'next';
import { env } from 'env.mjs';

const META_DATA_DEFAULT: Metadata = {
  applicationName: 'Dcarbon',
  authors: {
    name: 'DCarbon',
    url: env.NEXT_PUBLIC_BASE_URL,
  },
  creator: 'https://dcarbon.org',
  description:
    'Dcarbon is your go-to platform to buy and sell carbon credits. Join our sustainable marketplace to trade verified carbon offsets and support environmental responsibility.',
  keywords: [
    'Nextjs',
    'DCO2',
    'Certificate',
    'Carbon creadits',
    'Dcarbon',
    'Solana',
    'USDT',
    'USDC',
    'NFT',
    'Crypto',
    'Mint',
    'Blockchain',
  ],
  title: {
    default:
      'DCarbon - Buy DDarbon and Sell Carbon Credits | Sustainable Marketplace',
    absolute:
      'DCarbon - Buy DCarbon and Sell Carbon Credits | Sustainable Marketplace',
  },
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  openGraph: {
    title:
      'DCarbon - Buy DCarbon and Sell Carbon Credits | Sustainable Marketplace',
    description:
      'DCarbon is your go-to platform to buy and sell carbon credits. Join our sustainable marketplace to trade verified carbon offsets and support environmental responsibility.',
    url: env.NEXT_PUBLIC_BASE_URL,
    type: 'website',
    siteName: 'DCarbon',
    locale: 'en_US',
    images: [
      {
        url: `${env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/public/og.png'`,
        width: 1200,
        height: 630,
        alt: 'DCarbon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'DCarbon - Buy DCarbon and Sell Carbon Credits | Sustainable Marketplace',
    description:
      'DCarbon is your go-to platform to buy and sell carbon credits. Join our sustainable marketplace to trade verified carbon offsets and support environmental responsibility.',
    creator: '@DCarbon_Project',
    images: [
      `${env.NEXT_PUBLIC_BUCKET_ENPOINT}/public/common/dcarbon-banner.jpeg`,
    ],
  },
};

export { META_DATA_DEFAULT };
