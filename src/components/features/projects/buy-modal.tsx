'use client';

import React from 'react';
import DCarbonButton from '@/components/common/button';
import DCarbonModal from '@/components/common/modal';
import swapIcon from 'public/images/projects/swap-icon.png';
import { NumericFormat } from 'react-number-format';

function BuyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  return (
    <DCarbonModal
      onClose={onClose}
      isOpen={isOpen}
      title="Market"
      icon={swapIcon.src}
      cancelBtn={
        <DCarbonButton fullWidth className="bg-[#F6F6F6]" onClick={onClose}>
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
              className="text-sm w-full bg-[#F6F6F6] p-3 rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal focus:bg-white"
              placeholder="0.1 ~ 10.000"
            />
          </div>
        </div>
      </div>
    </DCarbonModal>
  );
}

export default BuyModal;
