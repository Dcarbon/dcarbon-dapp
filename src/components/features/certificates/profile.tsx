'use client';

import React from 'react';
import NextImage from 'next/image';
import { ShowAlert } from '@/components/common/toast';
import { Image } from '@nextui-org/react';
import copyIcon from 'public/images/common/copy.svg';
import { useCopyToClipboard } from 'usehooks-ts';

function CertificateProfile() {
  const [, copy] = useCopyToClipboard();
  return (
    <div className="mt-[10px] text-sm font-light flex gap-[5px]">
      <span>0x9157...jatmisiopakg48jga8smb</span>
      <button
        onClick={async () => {
          await copy('0x9157...jatmisiopakg48jga8smb');
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
