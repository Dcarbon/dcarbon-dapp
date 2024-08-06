'use client';

import React from 'react';
import NextImage from 'next/image';
import { ShowAlert } from '@/components/common/toast';
import { Image } from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import copyIcon from 'public/images/common/copy.svg';
import { useCopyToClipboard } from 'usehooks-ts';

function CertificateProfile() {
  const [, copy] = useCopyToClipboard();
  const { publicKey } = useWallet();

  const shortWalletAddress =
    (publicKey?.toBase58()?.slice(0, 5) || '') +
    '...' +
    (publicKey?.toBase58()?.slice(-5) || '');
  return (
    <div className="mt-[10px] text-sm font-light flex gap-[5px]">
      <span>{publicKey ? shortWalletAddress : ''}</span>
      <button
        onClick={async () => {
          await copy(publicKey?.toBase58() || '');
          ShowAlert.success({ message: 'Copied to clipboard' });
        }}
      >
        <Image
          src={copyIcon.src}
          alt="Copy"
          width={20}
          height={20}
          as={NextImage}
          draggable={false}
        />
      </button>
    </div>
  );
}

export default CertificateProfile;
