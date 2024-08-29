import { Metadata } from 'next';
import { env } from 'env.mjs';

const META_DATA_DEFAULT: Metadata = {
  applicationName: 'Dcarbon',
  authors: {
    name: 'Dcarbon',
    url: env.NEXT_PUBLIC_BASE_URL,
  },
  creator: 'Dcarbon',
  description:
    'Dcarbon is your go-to platform to buy and sell carbon credits. Join our sustainable marketplace to trade verified carbon offsets and support environmental responsibility.',
  keywords: [
    'Nextjs',
    'DCO2',
    'Certificate',
    'Carbon creadits',
    'Dcarbon',
    'NFT',
    'Crypto',
    'Blockchain',
  ],
  title: {
    default:
      'Dcarbon - Buy Dcarbon and Sell Carbon Credits | Sustainable Marketplace',
    absolute:
      'Dcarbon - Buy Dcarbon and Sell Carbon Credits | Sustainable Marketplace',
  },
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
};

export { META_DATA_DEFAULT };
