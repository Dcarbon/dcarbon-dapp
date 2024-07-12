'use client';

import React from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import DCarbonButton from '@/components/common/button';
import { WEB_ROUTES } from '@/utils/constants';
import { Card, CardBody, CardFooter, Image, Link } from '@nextui-org/react';
import quickBuyImage from 'public/images/projects/quick-buy-cover.avif';
import ReactCountryFlag from 'react-country-flag';

function ProjectContent({
  data,
}: {
  data: {
    data: {
      id: string;
      slug: string;
      project_name: string;
      country: string;
      country_name: string;
      location: string;
      power: number;
      thumbnail: string;
    }[];
  };
}) {
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');

  return (
    <div className="w-full">
      {mode === 'quick-buy' ? (
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
      ) : (
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-[2px]">
          {data?.data?.map((item) => (
            <div key={item.id}>
              <Card
                shadow="none"
                radius="none"
                classNames={{ base: 'rounded-[4px] border-1' }}
                isHoverable
                as="div"
              >
                <CardBody className="overflow-visible p-0 relative">
                  <Link
                    className="block"
                    href={WEB_ROUTES.PROJECT_DETAIL?.replace(
                      '[slug]',
                      item?.slug || '',
                    )}
                  >
                    <Image
                      shadow="none"
                      radius="none"
                      width="100%"
                      alt={item?.project_name || ''}
                      className="w-full object-cover h-[158px] rounded-bl-[4px] rounded-br-[4px]"
                      src={item.thumbnail}
                      draggable={false}
                      isZoomed
                    />
                  </Link>

                  <div className="absolute left-2 right-2 bottom-2 z-10 flex gap-1 items-center justify-end">
                    <ReactCountryFlag
                      countryCode={item?.country || ''}
                      svg
                      className="!w-[24px] !h-[16px]"
                    />
                    <span className="text-white text-xs">
                      {item.location || ''}
                      {item?.country_name ? `, ${item.country_name}` : ''}
                    </span>
                  </div>
                </CardBody>
                <CardFooter className="flex flex-col items-start">
                  <Link
                    className="block w-full"
                    href={WEB_ROUTES.PROJECT_DETAIL?.replace(
                      '[slug]',
                      item?.slug || '',
                    )}
                  >
                    <h2 className="text-lg font-medium text-[#21272A] mb-1">
                      {item.project_name || ''}
                    </h2>

                    <div className="text-sm text-[#4F4F4F]">
                      Sản lượng: {item?.power || ''}
                    </div>

                    <p className="text-sm text-[#21272A] my-4">
                      Dự án Miền Nam
                    </p>
                  </Link>

                  <DCarbonButton color="primary" fullWidth>
                    Buy Now
                  </DCarbonButton>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectContent;
