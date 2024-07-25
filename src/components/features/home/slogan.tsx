'use client';

import React from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import { Image } from '@nextui-org/react';
import { motion } from 'framer-motion';
import arrowRightButtonImage from 'public/images/home/arrow-right-button.svg';

function Slogan() {
  return (
    <div className="flex flex-col gap-4">
      <motion.h2
        className="text-2xl sm:text-5xl font-semibold text-center"
        initial={{ opacity: 0, y: -80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
        }}
      >
        <span className="text-primary-color">DCarbon</span> a Trustless and{' '}
        <br /> autonomous Carbon system
      </motion.h2>

      <motion.p
        className="text-[#d9d9d9] text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
        }}
      >
        Accurately measure, report and verify carbon footprints reduced, then{' '}
        <br /> bring them to the blockchains.
      </motion.p>

      <motion.div
        className="flex"
        initial={{ opacity: 0, y: 53 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
        }}
      >
        <DCarbonButton
          color="primary"
          className="mt-[11px] h-[53px] mx-auto"
          endContent={
            <Image
              src={arrowRightButtonImage.src}
              width={20}
              height={20}
              as={NextImage}
              alt="Arrow Right"
              radius="none"
              draggable={false}
            />
          }
        >
          Get in touch
        </DCarbonButton>
      </motion.div>
    </div>
  );
}

export default Slogan;
