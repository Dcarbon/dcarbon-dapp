'use client';

import React from 'react';
import NextImage from 'next/image';
import { Image, useDisclosure } from '@nextui-org/react';
import swapIcon from 'public/images/projects/swap-icon.svg';
import transferIcon from 'public/images/projects/transfer-icon.svg';
import { NumericFormat } from 'react-number-format';

import DCarbonButton from '../common/button';
import DCarbonModal from '../common/modal';

function SwapModal() {
  const { onClose } = useDisclosure();
  return (
    <DCarbonModal
      onClose={onClose}
      isOpen
      title="Swap Token"
      icon={swapIcon.src}
      cancelBtn={
        <DCarbonButton fullWidth className="bg-[#F6F6F6]">
          Cancel
        </DCarbonButton>
      }
      okBtn={
        <DCarbonButton color="primary" fullWidth>
          Swap
        </DCarbonButton>
      }
      extra={
        <div className="px-[10px] bg-[#F6F6F6] rounded-lg">
          <span className="text-sm font-light text-[#4F4F4F] leading-none">
            Balance:{' '}
          </span>
          <span className="text-sm text-[#5DAF01] font-normal leading-none">
            40 DCarbon
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-2 items-center mb-2">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm" htmlFor="total">
            You send
          </label>
          <div className="relative">
            <NumericFormat
              thousandSeparator
              allowNegative={false}
              id="you_send"
              className="text-sm w-full bg-[#F6F6F6] p-3 pr-[88.63px] rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
              placeholder="0.1"
            />

            <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
              DCarbon
            </div>
          </div>
        </div>
        <div>
          <Image
            src={transferIcon.src}
            alt="Transfer"
            as={NextImage}
            width={32}
            height={32}
            draggable={false}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm" htmlFor="total">
            You get
          </label>
          <div className="relative">
            <NumericFormat
              thousandSeparator
              allowNegative={false}
              id="you_send"
              className="text-sm w-full bg-[#F6F6F6] p-3 pr-[92.63px] rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
              placeholder="0.1"
            />

            <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
              DCarbon2
            </div>
          </div>
        </div>
      </div>
    </DCarbonModal>
  );
}

export default SwapModal;
