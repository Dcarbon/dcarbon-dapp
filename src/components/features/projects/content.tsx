'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import { doGetProjetList } from '@/adapters/project';
import DCarbonButton from '@/components/common/button';
import NoData from '@/components/common/no-data';
import { QUERY_KEYS, WEB_ROUTES } from '@/utils/constants';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Link,
  Spinner,
} from '@nextui-org/react';
import { useInView } from 'framer-motion';
import quickBuyImage from 'public/images/projects/quick-buy-cover.avif';
import ReactCountryFlag from 'react-country-flag';
import useSWRInfinite from 'swr/infinite';
import { useDebounceValue } from 'usehooks-ts';
import { useProjectStore } from '@/app/project-store-provider';

type ProjectResponse = {
  id: string;
  slug: string;
  project_name: string;
  country: string;
  country_name: string;
  location: { name: string };
  power: number;
  thumbnail: string;
  type?: {
    id: number;
    name: string;
  };
};

function ProjectContent({
  initialData,
}: {
  initialData: {
    data: ProjectResponse[];
  };
}) {
  const searchParams = useSearchParams();
  const keyword = useProjectStore((state) => state.keyword);
  const [debouncedKeyword] = useDebounceValue(keyword, 500);
  const [spinRef, setSpinRef] = useState<any>({
    current: null,
  });
  const isInView = useInView(spinRef);
  const filters = useProjectStore((state) => state.filters);

  const mode = searchParams.get('mode');
  const model = searchParams.get('model');
  let iot_model;

  switch (model) {
    case 'G':
      iot_model = 'PrjT_G' as const;
      break;
    case 'E':
      iot_model = 'PrjT_E' as const;
      break;
    default:
      iot_model = undefined;
      break;
  }

  const totalPage = Math.ceil(
    ((initialData as any)?.paging?.total || 1) /
      ((initialData as any)?.paging?.limit || 1),
  );
  const setLoading = useProjectStore((state) => state.setLoading);

  useEffect(() => {
    let count = 0;
    const checkSpinner = () => {
      const spinnerEl = document.querySelector('#spinner');
      if (spinnerEl) {
        setSpinRef({ current: spinnerEl });
      }
      count++;
    };

    const id = mode === 'quick-buy' ? 0 : setInterval(checkSpinner, 1000);

    if (spinRef?.current) {
      clearInterval(id);
    }

    if (count >= 100) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [mode, spinRef]);

  const { data, size, setSize, isLoading } = useSWRInfinite(
    (index) => {
      return [
        QUERY_KEYS.PROJECTS.GET_PROJECTS,
        debouncedKeyword,
        index,
        filters,
        model,
      ];
    },
    ([, debouncedKeyword, index, filters]) => {
      if (index + 1 > totalPage) {
        return null;
      }
      return doGetProjetList({
        keyword: debouncedKeyword,
        page: index + 1,
        country: filters?.country?.value,
        location: filters?.location,
        quantity: filters?.quantity,
        iot_model,
      });
    },
    {
      fallbackData: [initialData] as any,
      keepPreviousData: true,
      parallel: true,
      revalidateFirstPage: false,
      persistSize: true,
    },
  );

  useEffect(() => {
    if (isInView && size < totalPage) {
      setSize((size) => size + 1);
    }

    const id = setInterval(() => {
      if (isInView && size < totalPage) {
        setSize((size) => size + 1);
      }
    }, 500);

    if (size >= totalPage || !isInView) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [isInView]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const dataMerged = useMemo(
    () =>
      (data as any)?.reduce((prevData: any, current: any) => {
        return prevData.concat(current?.data || []);
      }, []),
    [data],
  );

  return (
    <>
      <div className="w-full relative">
        {mode === 'quick-buy' ? (
          <div className="relative w-full min-h-[807px]">
            <Image
              src={quickBuyImage.src}
              alt="quick buy"
              draggable={false}
              as={NextImage}
              width={1336}
              height={807}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
              radius="none"
              className="rounded-[16px]"
              removeWrapper
            />
          </div>
        ) : dataMerged?.length !== 0 ? (
          <>
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 mt-[2px]">
              {dataMerged?.map((item: ProjectResponse) => {
                return (
                  <div key={item.id}>
                    <Card
                      shadow="none"
                      radius="none"
                      classNames={{ base: 'rounded-[4px] border-1 h-full' }}
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
                            {item.location?.name || ''}
                            {item?.country_name ? `, ${item.country_name}` : ''}
                          </span>
                        </div>
                      </CardBody>
                      <CardFooter className="flex flex-col items-start justify-between h-full">
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
                            {model === 'E' ? 'Power' : 'Production'}:{' '}
                            {item?.power || ''} {model === 'E' ? 'kVA' : 'Ton'}
                          </div>

                          <p className="text-sm text-[#21272A] my-4">
                            {item.type?.name || ''}
                          </p>
                        </Link>

                        <Link
                          href={WEB_ROUTES.PROJECT_DETAIL?.replace(
                            '[slug]',
                            item?.slug || '',
                          )}
                          className="w-full"
                        >
                          <DCarbonButton color="primary" fullWidth>
                            Buy Now
                          </DCarbonButton>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
            {totalPage > 1 && size < totalPage && (
              <div className="flex w-full justify-center mt-6">
                <Spinner id="spinner" color="success" />
              </div>
            )}
          </>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}

export default ProjectContent;
