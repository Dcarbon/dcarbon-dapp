'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import DCarbonModal from '@/components/common/modal';
import { cn, Image } from '@nextui-org/react';
import dropdown from 'public/images/common/arrow-down-icon.svg';
import logo from 'public/images/common/logo.svg';
import swapIcon from 'public/images/projects/swap-icon.png';

type QuickBuyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: [];
  handleBuy: () => void;
};
const QuickBuyModal = ({
  isOpen,
  onClose,
  data,
  handleBuy,
}: QuickBuyModalProps) => {
  const [showMore, setShowMore] = useState(false);

  const getUnitPrice = useCallback((keys: string[]) => {
    console.info('keys', keys);
  }, []);

  useEffect(() => {
    isOpen && getUnitPrice([]);
  }, [isOpen, getUnitPrice]);

  return (
    <DCarbonModal
      onClose={onClose}
      isOpen={isOpen}
      title="Quick buy"
      icon={swapIcon.src}
      cancelBtn={
        <DCarbonButton fullWidth className="bg-[#F6F6F6]" onClick={onClose}>
          Cancel
        </DCarbonButton>
      }
      okBtn={
        <DCarbonButton color="primary" fullWidth onClick={handleBuy}>
          Buy
        </DCarbonButton>
      }
    >
      <div className="flex flex-col gap-2 mb-2">
        <p className="font-bold text-[15px]">
          Are you sure you want to proceed with this purchase?
        </p>
        <p className="font-light text-sm">
          {
            "If you're reconsidering, you can always Visit our List of Projects and purchase DCO2 tokens tailored to your preferences."
          }
        </p>
        <div
          className={cn(
            'flex flex-col gap-2 w-full mt-3',
            showMore ? ' max-h-[300px] h-auto overflow-y-auto' : '',
          )}
        >
          <div className="flex px-4 py-2 rounded items-center justify-between bg-[#F6F6F6]">
            <div className="flex gap-2 items-center">
              <Image
                src={logo.src}
                alt="logo"
                width={24}
                height={24}
                as={NextImage}
              />
              <div className="font-normal text-text-primary flex items-center gap-1">
                <span>10</span>
                <span>DCO2 277-1</span>
              </div>
            </div>
            <div className="flex gap-1 items-baseline  text-text-primary">
              <span className="font-light text-[12px]">Unit Price:</span>
              <span className="text-sm font-medium text-primary-color">
                {' '}
                10 USDT
              </span>
            </div>
          </div>
        </div>
        {data.length > 3 ? (
          <p className="text-right select-none">
            <span
              className="text-text-primary font-light text-[12px] flex items-center gap-2 justify-end cursor-pointer"
              onClick={() => setShowMore(!showMore)}
            >
              {!showMore ? 'Show more' : 'Show less'}
              <Image
                src={dropdown.src}
                alt="dropdown"
                width={14}
                height={14}
                as={NextImage}
                className={cn('transition-all', showMore ? 'rotate-180' : '')}
              />
            </span>
          </p>
        ) : null}
        <p className="flex gap-1 items-baseline justify-end font-medium">
          <span className="text-[12px] font-light text-text-primary">
            Total:
          </span>
          <span className="text-sm font-medium text-primary-color">
            10 USDT
          </span>
        </p>
      </div>
    </DCarbonModal>
  );
};

export default memo(QuickBuyModal);
