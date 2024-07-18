'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import NextImage from 'next/image';
import { cn, Image } from '@nextui-org/react';
import useEmblaCarousel from 'embla-carousel-react';
import arrowActive from 'public/images/projects/arrow-active.svg';
import arrowInactive from 'public/images/projects/arrow-inactive.svg';

function ProjectDetailCarousel({ data }: { data: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      dragFree: true,
      breakpoints: {
        '(min-width: 1024px)': {
          watchDrag: false,
        },
      },
    },
    [],
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [canNext, setCanNext] = useState<boolean>(true);
  const [canPrev, setCanPrev] = useState<boolean>(false);

  useEffect(() => {
    const handleScrollSnap = (api: any) => {
      if (emblaApi) {
        const currentIndex = api.selectedScrollSnap();
        setCurrentSlideIndex(currentIndex);
        setCanNext(api.canScrollNext());
        setCanPrev(api.canScrollPrev());
      }
    };

    if (emblaApi) {
      emblaApi.on('select', handleScrollSnap);
    }

    return () => {
      if (emblaApi) {
        emblaApi.off('select', handleScrollSnap);
      }
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="embla overflow-hidden mb-[46px]">
      <div className="embla__viewport relative" ref={emblaRef}>
        <div className="embla__container flex">
          {data?.map((image: any, index: number) => (
            <div
              key={index}
              className={cn(
                'embla__slide relative w-full transition-[flex]',
                index === data.length - 1 ? 'mr-0' : 'mr-8',
                currentSlideIndex === index
                  ? 'flex-[0_0_100%] lg:flex-[0_0_803px] h-[460px]'
                  : 'flex-[0_0_100%] h-[460px] lg:flex-[0_0_390px] lg:h-[390px]',
                data.length < 3 && '!flex-[0_0_100%] !h-[460px]',
              )}
            >
              <Image
                removeWrapper
                src={image}
                alt="Image"
                as={NextImage}
                draggable={false}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {data?.length > 1 && (
          <>
            <button
              className={cn(
                'embla__prev absolute right-[94px] bottom-6 lg:left-6 xl:left-[unset] xl:right-[70px] xl:bottom-0',
                data.length < 3 && '!right-[94px] !bottom-6',
              )}
              onClick={scrollPrev}
            >
              {canPrev ? (
                <Image
                  src={arrowActive.src}
                  alt="left"
                  as={NextImage}
                  width={46}
                  height={46}
                  draggable={false}
                  className="rotate-180 !transition-none !animate-none"
                />
              ) : (
                <Image
                  src={arrowInactive.src}
                  alt="left"
                  as={NextImage}
                  width={46}
                  height={46}
                  draggable={false}
                  className="!transition-none !animate-none"
                />
              )}
            </button>
            <button
              className={cn(
                'embla__next absolute bottom-6 right-6 lg:left-[94px] xl:left-[unset] xl:right-0 xl:bottom-0',
                data.length < 3 && '!right-6 !bottom-6',
              )}
              onClick={scrollNext}
            >
              {!canNext ? (
                <Image
                  src={arrowInactive.src}
                  alt="right"
                  as={NextImage}
                  width={46}
                  height={46}
                  draggable={false}
                  className="rotate-180 !transition-none !animate-none"
                />
              ) : (
                <Image
                  src={arrowActive.src}
                  alt="right"
                  as={NextImage}
                  width={46}
                  height={46}
                  draggable={false}
                  className="!transition-none !animate-none"
                />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(ProjectDetailCarousel);
