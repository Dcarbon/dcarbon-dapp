'use client';

import NextImage from 'next/image';
import { Image } from '@nextui-org/react';
import serverErr from 'public/images/common/dcarbon-500.svg';
import logo from 'public/images/common/full-logo-dark.svg';

const GlobalError = () => {
  return (
    <html>
      <body>
        <section className="bg-white dark:bg-gray-900 p-4 w-[100dvw] h-[100dvh] overflow-hidden">
          <div className="w-full flex justify-center items-center">
            <Image
              src={logo.src}
              as={NextImage}
              alt="logo"
              width={164}
              height={32}
              draggable={false}
            />
          </div>
          <div className="flex h-[calc(100dvh-32px)] items-center justify-center">
            <Image
              src={serverErr.src}
              alt="error 500"
              width={680}
              height={454}
              className="max-w-[680px] !max-h-[454px] !h-fit w-full]"
              as={NextImage}
              draggable={false}
              loading="eager"
              radius="none"
            />
          </div>
        </section>
      </body>
    </html>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default GlobalError;
