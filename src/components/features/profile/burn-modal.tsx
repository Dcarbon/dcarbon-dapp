import React from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import DCarbonModal from '@/components/common/modal';
import { Image } from '@nextui-org/react';
import Big from 'big.js';
import logoIcon from 'public/images/common/logo.svg';
import burnIcon from 'public/images/profile/burn-icon.png';
import { NumericFormat } from 'react-number-format';

function BurnModal({
  isOpen,
  onClose,
  amount,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
}) {
  return (
    <DCarbonModal
      onClose={onClose}
      isOpen={isOpen}
      title="Burned CARBON can not be recirculated"
      icon={burnIcon.src}
      cancelBtn={
        <DCarbonButton fullWidth className="bg-[#F6F6F6]" onClick={onClose}>
          Cancel
        </DCarbonButton>
      }
      okBtn={
        <DCarbonButton color="primary" fullWidth>
          Next
        </DCarbonButton>
      }
      description="Every CARBON counts towards a net zero future. Are you ready to make a difference today?"
    >
      <div className="flex flex-col gap-2 items-center mb-2">
        <div className="flex flex-col gap-2 w-full">
          {amount ? (
            <div className="flex items-center gap-2 justify-center">
              <Image
                src={logoIcon.src}
                alt="DCarbon"
                width={32}
                height={32}
                as={NextImage}
                draggable={false}
              />
              <span className="text-xl">
                {Number(Big(amount).toFixed(4)).toLocaleString('en-US')} Carbon
              </span>
            </div>
          ) : (
            <div className="relative">
              <NumericFormat
                thousandSeparator
                allowNegative={false}
                id="you_send"
                className="text-sm w-full bg-[#F6F6F6] p-3 pr-[88.63px] rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal"
                placeholder="0.1"
              />

              <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                Carbon
              </div>
            </div>
          )}
        </div>
      </div>
    </DCarbonModal>
  );
}

export default BurnModal;
