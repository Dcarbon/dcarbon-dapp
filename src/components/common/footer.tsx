import React from 'react';
import NextImage from 'next/image';
import { Image, Link } from '@nextui-org/react';
import facebook from 'public/images/common/facebook.svg';
import fullLogoImage from 'public/images/common/full-logo.svg';
import instagram from 'public/images/common/instagram.svg';
import linkedin from 'public/images/common/linkedin.svg';
import x from 'public/images/common/x.svg';
import youtube from 'public/images/common/youtube.svg';

import FeedbackModal from '../features/feedback';

function Footer() {
  return (
    <footer className="bg-text-primary pt-[24px] px-[64px] pb-[48px] z-10 relative">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center">
          <Image
            className="min-w-[164px]"
            src={fullLogoImage.src}
            alt="logo"
            as={NextImage}
            width={164}
            height={32}
            draggable={false}
          />
        </div>

        <nav>
          <Link href="#" className="py-3 px-2 text-sm text-[#C8C8C8]">
            About
          </Link>
          <Link href="#" className="py-3 px-2 text-sm text-[#C8C8C8]">
            Advertise
          </Link>
          <Link href="#" className="py-3 px-2 text-sm text-[#C8C8C8]">
            Terms & Conditions
          </Link>
          <Link href="#" className="py-3 px-2 text-sm text-[#C8C8C8]">
            Policy
          </Link>
          <FeedbackModal />
        </nav>

        <div className="flex gap-2">
          <Link
            href="#"
            isExternal
            className="w-8 h-8 flex justify-center items-center bg-white/10 rounded-full"
          >
            <Image
              src={x.src}
              alt="X"
              draggable={false}
              as={NextImage}
              width={16}
              height={16}
              radius="none"
            />
          </Link>

          <Link
            href="#"
            isExternal
            className="w-8 h-8 flex justify-center items-center bg-white/10 rounded-full"
          >
            <Image
              src={linkedin.src}
              alt="Linkedin"
              draggable={false}
              as={NextImage}
              width={16}
              height={16}
              radius="none"
            />
          </Link>

          <Link
            href="#"
            isExternal
            className="w-8 h-8 flex justify-center items-center bg-white/10 rounded-full"
          >
            <Image
              src={facebook.src}
              alt="Facebook"
              draggable={false}
              as={NextImage}
              width={10}
              height={8}
              radius="none"
            />
          </Link>

          <Link
            href="#"
            isExternal
            className="w-8 h-8 flex justify-center items-center bg-white/10 rounded-full"
          >
            <Image
              src={youtube.src}
              alt="Youtube"
              draggable={false}
              as={NextImage}
              width={16}
              height={16}
              radius="none"
            />
          </Link>

          <Link
            href="#"
            isExternal
            className="w-8 h-8 flex justify-center items-center bg-white/10 rounded-full"
          >
            <Image
              src={instagram.src}
              alt="Instagram"
              draggable={false}
              as={NextImage}
              width={16}
              height={16}
              radius="none"
            />
          </Link>
        </div>
      </div>

      <div className="text-[#c8c8c8] text-xs mt-12 mx-auto w-fit">
        © 2024 DECARBON . All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
