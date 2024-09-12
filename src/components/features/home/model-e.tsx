import React from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import { WEB_ROUTES } from '@/utils/constants';
import { Image, Link } from '@nextui-org/react';
import section2Image from 'public/images/home/section-2.avif';

function ModelE() {
  return (
    <section className="relative h-screen w-full">
      <Image
        removeWrapper
        src={section2Image.src}
        alt="Section 2"
        as={NextImage}
        draggable={false}
        radius="none"
        fill
        style={{
          objectFit: 'cover',
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-between items-center flex-col py-[70px]">
        <div className="max-w-[704px] flex flex-col gap-4 items-center text-white">
          <h2 className="text-[44px] font-medium">Model E</h2>
          <p className="text-center text-lg">
            Biogas to electricity converts organic waste into clean, renewable
            energy, reducing greenhouse gas emissions and promoting
            sustainability.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 justify-center items-center">
          <DCarbonButton className="min-w-[200px]">
            <Link
              className="absolute top-0 left-0 w-full h-full flex justify-center text-sm text-text-primary"
              href={WEB_ROUTES.PROJECTS + '?mode=quick-buy&model=E'}
            >
              Order now
            </Link>
          </DCarbonButton>
          <DCarbonButton color="primary" className="min-w-[200px]">
            Learn more
          </DCarbonButton>
        </div>
      </div>
    </section>
  );
}

export default ModelE;
