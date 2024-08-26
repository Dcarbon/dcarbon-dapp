'use client';

import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import { Image, Link } from '@nextui-org/react';
import notfound from 'public/images/common/dcarbon-404.svg';

const NotFound = () => {
  return (
    <section className="bg-white dark:bg-gray-900 h-[70dvh] sm:h-[75dvh] md:h-[80dvh] p-4 flex flex-col justify-center items-center gap-4">
      <Image
        src={notfound.src}
        alt="logo"
        width={680}
        height={454}
        className="max-w-[680px] !max-h-[454px] !h-fit w-full mt-60px] "
        as={NextImage}
        draggable={false}
        loading="eager"
        radius="none"
      />
      <Link href="/">
        <DCarbonButton color="primary">Go back</DCarbonButton>
      </Link>
    </section>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default NotFound;
