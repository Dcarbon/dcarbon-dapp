import React from 'react';
import NextImage from 'next/image';
import Sidebar from '@/components/features/projects/sidebar';
import { Image } from '@nextui-org/react';
import quickBuyImage from 'public/images/projects/quick-buy-cover.avif';

async function Projects() {
  return (
    <main className="px-4 lg:px-[64px] pb-[10px] mt-[90px] lg:mt-[60px] h-screen flex gap-[48px]">
      <div>
        <Image
          src={quickBuyImage.src}
          alt="quick buy"
          draggable={false}
          as={NextImage}
          width={1336}
          height={807}
          radius="none"
          className="rounded-[16px]"
        />
      </div>

      <Sidebar />
    </main>
  );
}

const dynamic = 'force-dynamic';

export { dynamic };

// eslint-disable-next-line import/no-unused-modules
export default Projects;
