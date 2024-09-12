'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { Image } from '@nextui-org/react';
import heroImage from 'public/images/home/hero.avif';
import { useEventListener } from 'usehooks-ts';

function Hero() {
  const [scale, setScale] = useState<number>(1);
  const onScroll = () => {
    const scroll = window.scrollY;
    const scale = 1 + scroll / 1000;
    setScale(scale);
  };

  useEventListener('scroll', onScroll);
  return (
    <Image
      removeWrapper
      src={heroImage.src}
      alt="Hero"
      as={NextImage}
      draggable={false}
      radius="none"
      fill
      style={{
        objectFit: 'cover',
        transform: `scale(${scale > 1.35 ? 1.35 : scale})`,
      }}
      priority
      sizes="(max-width: 768px) 768px, (max-width: 960px) 960px, 100vw"
    />
  );
}

export default Hero;
