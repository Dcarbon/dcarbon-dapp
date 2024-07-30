import React from 'react';
import NextImage from 'next/image';
import { Image } from '@nextui-org/react';
import noDataIcon from 'public/images/common/no-data-icon.svg';

function NoData() {
  return (
    <div className="flex flex-col items-center gap-2 p-6 h-full justify-center">
      <Image
        src={noDataIcon.src}
        alt="No data"
        width={32}
        height={32}
        as={NextImage}
        draggable={false}
        radius="none"
      />
      <span className="text-[#888]">No data!</span>
    </div>
  );
}

export default NoData;
