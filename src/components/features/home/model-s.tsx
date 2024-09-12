import React from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import { Image } from '@nextui-org/react';
import section4Image from 'public/images/home/section-4.avif';

function ModelS() {
  return (
    <section className="relative h-screen w-full">
      <Image
        removeWrapper
        src={section4Image.src}
        alt="Section 4"
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
          <h2 className="text-[44px] font-medium">Model S</h2>
          <p className="text-center text-lg">
            Transforms organic waste into biochar, a stable form of carbon that
            not only sequesters carbon dioxide but also enhances soil fertility
            and agricultural productivity.
          </p>
        </div>

        <div>
          <div className="text-white text-[28px] font-light mb-6 text-center">
            Coming soon
          </div>

          <div className="flex flex-wrap gap-8 justify-center items-center">
            <DCarbonButton className="min-w-[200px]" isDisabled>
              {/* <Link
                    className="absolute top-0 left-0 w-full h-full flex justify-center text-sm text-text-primary"
                    href={WEB_ROUTES.PROJECTS}
                  > */}
              Order now
              {/* </Link> */}
            </DCarbonButton>
            <DCarbonButton color="primary" className="min-w-[200px]" isDisabled>
              Learn more
            </DCarbonButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ModelS;
