import React from 'react';
import NextImage from 'next/image';
import { Image } from '@nextui-org/react';
import blurBackground from 'public/images/certificates/blur-background.svg';
import NftCertificate from '@components/features/certificate/nft';

function Certificate() {
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
      <NftCertificate />
    </main>
  );
}

export default Certificate;
