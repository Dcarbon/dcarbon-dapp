import React from 'react';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import DCarbonButton from '@/components/common/button';
import AreaChart from '@/components/common/chart/area-chart';
import { Skeleton } from '@/components/common/loading';
import { isEmpty } from '@/utils/helpers/common';
import { Button, cn, Image, Spinner } from '@nextui-org/react';
import active from 'public/images/projects/active.svg';
import inactive from 'public/images/projects/inactive.svg';

type TabContentProps = {
  devices: {}[];
  selectedDevice: string | null;
  chartData: number[];
  handleSelectDevice: (device_id: string) => void;
  isMutating: boolean;
  paging: {
    limit: number;
    page: number;
    total: number;
  } | null;
  trigger: (arg0: {
    type: 'device_data';
    devices_limit: number;
    devices_page: number;
  }) => void;
  model?: string;
};

const TabContent = ({
  chartData,
  devices,
  handleSelectDevice,
  isMutating,
  paging,
  selectedDevice,
  trigger,
  model,
}: TabContentProps) => {
  const { slug } = useParams<{ slug: string }>();
  if (isEmpty(devices) && !isMutating) {
    return (
      <div className="flex flex-col xl:flex-row xl:flex-nowrap h-[390px] gap-8 w-full justify-center items-center text-[#888888]">
        No data
      </div>
    );
  }
  return (
    <div className="flex flex-col xl:flex-row xl:flex-nowrap gap-8 w-full">
      <div className="flex gap-y-6 py-2 flex-row max-w-[100vw] gap-x-4 xl:gap-x-0 overflow-x-auto xl:flex-col flex-auto xl:max-w-[326px] xl:max-h-[430px] xl:h-full xl:overflow-y-auto scroll-w-none">
        {isMutating && !selectedDevice
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="min-h-[80px] min-w-[15rem]">
                <div className="p-4 rounded-lg bg-white flex h-[80px] max-w-[326px] min-w-[15rem] w-full" />
              </Skeleton>
            ))
          : devices?.map((device: any) => (
              <Button
                variant="bordered"
                key={device.device_id}
                onClick={() => handleSelectDevice(device.device_id)}
                className={cn(
                  'p-4 rounded-lg bg-white flex h-[80px] min-h-[80px] max-w-[326px] min-w-[15rem] w-full justify-start',
                  device.device_id === selectedDevice
                    ? 'border-primary-color bg-[#F6F6F6]'
                    : 'border-[#DDE1E6]',
                )}
              >
                <div className="flex gap-4 items-center justify-start">
                  <div className="w-12 h-12 bg-[#F6F6F6] flex justify-center items-center rounded-md">
                    <Image
                      src={device.is_active ? active.src : inactive.src}
                      alt="active"
                      as={NextImage}
                      draggable={false}
                      width={24}
                      height={24}
                      radius="none"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-between gap-2">
                    <span className="text-[23px] font-medium text-text-primary leading-6">
                      {device.is_active ? 'Actived' : 'Inactivated'}
                    </span>
                    <span className="text-sm text-[#697077] leading-4">
                      {device.device_name}
                    </span>
                  </div>
                </div>
              </Button>
            ))}
        {paging && paging.total / paging.limit > paging.page ? (
          <DCarbonButton
            className="xl:min-h-[40px] min-h-[80px] min-w-[10rem]  rounded-lg"
            color="primary"
            isLoading={isMutating}
            onClick={() =>
              trigger({
                type: 'device_data',
                devices_limit: 5,
                devices_page: paging.page + 1,
              })
            }
          >
            Load more
          </DCarbonButton>
        ) : null}
      </div>
      <div className="flex-auto relative">
        {isMutating ? (
          <div className="size-full absolute flex justify-center items-center z-50">
            <Spinner
              size="md"
              color="primary"
              classNames={{
                circle1: '!border-b-primary-color',
                circle2: '!border-b-primary-color',
              }}
            />
          </div>
        ) : null}
        <AreaChart data={chartData} slug={slug} model={model} />
      </div>
    </div>
  );
};

export default TabContent;
