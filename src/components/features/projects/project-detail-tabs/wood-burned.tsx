'use client';
import DCarbonButton from '@/components/common/button';
import AreaChart from '@/components/common/chart/area-chart';
import { Image } from '@nextui-org/react';
import active from 'public/images/projects/active.svg';
import inactive from 'public/images/projects/inactive.svg';
import NextImage from 'next/image'; import React from 'react';

const WoodBurned = () => {
  return (
    <div className='flex flex-col xl:flex-row xl:flex-nowrap gap-8 w-full'>
      <div className='flex gap-2 py-2 *:min-w-32 flex-row max-w-[100vw] overflow-x-auto xl:flex-col flex-auto xl:max-w-[326px] xl:max-h-[430px] xl:overflow-y-auto'>
        <DCarbonButton
          variant="bordered"
          color='primary'
          className='p-4 rounded-lg bg-[#F6F6F6] flex h-[80px] max-w-[326px] w-full justify-start'
        >
          <div className='flex gap-4 items-center justify-start'>
            <div className='w-12 h-12 bg-[#F6F6F6] flex justify-center items-center rounded-md'>
              <Image src={inactive.src} alt='active' as={NextImage} draggable={false} width={24} height={24} radius='none' />
            </div>
            <div className='flex flex-col items-start justify-between gap-2'>
              <span className='text-[23px] font-medium text-text-primary leading-6'>
                Inactivated
              </span>
              <span className='text-sm text-[#697077] leading-4'>
                Device IOT 404
              </span>
            </div>
          </div>
        </DCarbonButton>
        <DCarbonButton
          variant="bordered"
          className='p-4 rounded-lg flex h-[80px] max-w-[326px] w-full justify-start'
        >
          <div className='flex gap-4 items-center justify-start'>
            <div className='w-12 h-12 bg-[#F6F6F6] flex justify-center items-center rounded-md'>
              <Image src={active.src} alt='active' as={NextImage} draggable={false} width={24} height={24} radius='none' />
            </div>
            <div className='flex flex-col items-start justify-between gap-2'>
              <span className='text-[23px] font-medium text-text-primary leading-6'>
                Activated
              </span>
              <span className='text-sm text-[#697077] leading-4'>
                Device IOT 405
              </span>
            </div>
          </div>
        </DCarbonButton>
      </div>
      <div className='flex-auto'>
        <AreaChart
          data={[
            13, 1.435, 23.435, 90, 45.435, 87.435, 67.435, 140.435, 5.435, 60,
          ]}
        />
      </div>
    </div>
  );
};

export default WoodBurned;
