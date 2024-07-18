'use client';

import React from 'react';
import { useDisclosure } from '@nextui-org/react';
import swapIcon from 'public/images/projects/swap-icon.svg';
import { NumericFormat } from 'react-number-format';

import DCarbonButton from '../common/button';
import DCarbonModal from '../common/modal';

function BuyModal() {
  const { onClose } = useDisclosure();
  return (
    <DCarbonModal
      onClose={onClose}
      isOpen
      title="Market"
      icon={swapIcon.src}
      cancelBtn={
        <DCarbonButton fullWidth className="bg-[#F6F6F6]">
          Cancel
        </DCarbonButton>
      }
      okBtn={
        <DCarbonButton color="primary" fullWidth>
          Buy
        </DCarbonButton>
      }
    >
      <div className="flex flex-col gap-2 items-center mb-2">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm" htmlFor="total">
            Quantity
          </label>
          <div className="relative">
            <NumericFormat
              thousandSeparator
              allowNegative={false}
              id="you_send"
              className="text-sm w-full bg-[#F6F6F6] p-3 rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
              placeholder="0.1 ~ 10.000"
            />
          </div>
        </div>
      </div>
    </DCarbonModal>
  );
}

export default BuyModal;
