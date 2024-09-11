import React from 'react';
import { Metadata } from 'next';
import NextImage from 'next/image';
import { doGetCertificateDetail } from '@/adapters/user';
import { Image } from '@nextui-org/react';
import blurBackground from 'public/images/certificates/blur-background.svg';
import NftCertificate from '@components/features/certificate/nft';

function generateMetadata(): Metadata {
  return {
    description:
      'View detailed information about the NFTs you’ve minted on DCarbon. Explore the specifics, attributes, and impact of your carbon credit NFTs. Manage your minted assets with ease.',
    title:
      'DCarbon - View Details of Your Minted NFTs | Carbon Credit Insights',
  };
}
async function Certificate({ params }: any) {
  const { mint } = params;

  const certificateDetail = await doGetCertificateDetail(mint);
  return (
    <main className="px-4 lg:px-[64px] pb-[32px] mt-[90px] lg:mt-[60px] flex gap-[48px] bg-[#F6F6F6] relative">
      <Image
        src={blurBackground.src}
        alt="background"
        as={NextImage}
        fill
        draggable={false}
        removeWrapper
        className="object-cover"
      />
      <NftCertificate data={certificateDetail} />
    </main>
  );
}

export default Certificate;
export { generateMetadata };
