'use client';
import React, { useCallback, useEffect, useState } from 'react';
import AreaChart from '@/components/common/chart/area-chart';
import { Button, Image, Spinner, cn } from '@nextui-org/react';
import active from 'public/images/projects/active.svg';
import inactive from 'public/images/projects/inactive.svg';
import NextImage from 'next/image';
import useSWRMutation from 'swr/mutation';
import { QUERY_KEYS } from '@/utils/constants';
import { useParams } from 'next/navigation';
import { doGetCarbonMinted, GetCarbonMintedRequest } from '@/adapters/project';
import DCarbonButton from '@/components/common/button';

const CarbonMinted = () => {
  const params = useParams<{ slug: string }>();
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const [devices, setDevices] = useState<{}[]>([]);
  const [paging, setPaging] = useState<{
    limit: number;
    page: number;
    total: number;
  } | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const { trigger, isMutating, data } = useSWRMutation(
    [QUERY_KEYS.PROJECTS.GET_CARBON_MINTED_DASHBOARD, params.slug],
    (_, { arg }: { arg: GetCarbonMintedRequest }) => {
      return doGetCarbonMinted(params.slug, arg);
    },
    {
      onSuccess: ({ data }) => {
        if (data?.device_info?.devices) {
          setDevices([...devices, ...data.device_info.devices]);
          data.device_info.devices.forEach((device: any) => {
            if (device.is_selected) {
              setActiveDevice(device.device_id);
            }
          });
          setPaging(data.device_info.paging);
        }
        if (data.carbon_minted) {
          setChartData(data.carbon_minted.data);
        }
      },
      onError: (error) => {
        console.error(error);
      },

    },

  );
  useEffect(() => {
    trigger({
      type: 'all_data',
      devices_limit: 5,
      devices_page: 1,
    });
  }, [])
  const handleSelectDevice = useCallback((device_id: string) => {
    setActiveDevice(device_id);
    trigger({
      type: 'minted_data',
      device_id,
    });
  }, [])
  return (
    <div className='flex flex-col xl:flex-row xl:flex-nowrap gap-8 w-full'>
      <div className='flex gap-2 py-2 flex-row max-w-[100vw] overflow-x-auto xl:flex-col flex-auto xl:max-w-[326px] xl:max-h-[430px] xl:h-full xl:overflow-y-auto scroll-w-none'>
        {
          devices?.map((device: any) => (
            <Button
              variant="bordered"
              key={device.device_id}
              onClick={() => handleSelectDevice(device.device_id)}
              className={cn('p-4 rounded-lg bg-white flex h-[80px] min-h-[80px] max-w-[326px] min-w-[15rem] w-full justify-start', device.device_id === activeDevice ? 'border-primary-color bg-[#F6F6F6]' : 'border-[#DDE1E6]')}
            >
              <div className='flex gap-4 items-center justify-start'>
                <div className='w-12 h-12  flex justify-center items-center rounded-md'>
                  <Image src={device.is_active ? active.src : inactive.src} alt='active' as={NextImage} draggable={false} width={24} height={24} radius='none' />
                </div>
                <div className='flex flex-col items-start justify-between gap-2'>
                  <span className='text-[23px] font-medium text-text-primary leading-6'>
                    {device.is_active ? 'Actived' : 'Inactivated'}
                  </span>
                  <span className='text-sm text-[#697077] leading-4'>
                    {device.device_name}
                  </span>
                </div>
              </div>
            </Button>
          ))
        }
        {paging && (paging.total / paging.limit) > paging.page ? <DCarbonButton className='xl:min-h-[40px] min-h-[80px] min-w-[10rem]  rounded-lg' color='primary' isLoading={isMutating} onClick={() => trigger({
          type: 'device_data',
          devices_limit: 5,
          devices_page: paging.page + 1,
        })}>
          Load more
        </DCarbonButton> : null}
      </div>
      <div className='flex-auto relative'>
        {
          isMutating ? <div className='size-full absolute flex justify-center items-center z-50'>
            <Spinner size='md' color='primary' classNames={{
              circle1: '!border-b-primary-color',
              circle2: '!border-b-primary-color',
            }} />
          </div> : null}
        <AreaChart
          data={chartData}
        />
      </div>
    </div >
  );
};

export default CarbonMinted;
