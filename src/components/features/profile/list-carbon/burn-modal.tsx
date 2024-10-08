import React, { useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import NextImage from 'next/image';
import { IGetListCarbonResponse } from '@/adapters/user';
import DCarbonButton from '@/components/common/button';
import DCarbonModal from '@/components/common/modal';
import { generateBurningList } from '@/utils/helpers/profile';
import { cn, Image, useDisclosure } from '@nextui-org/react';
import Big from 'big.js';
import logoIcon from 'public/images/common/logo.svg';
import burnIcon from 'public/images/profile/burn-icon.png';
import { NumericFormat } from 'react-number-format';
import { KeyedMutator } from 'swr';

import CertificateModal from './certificate-modal';

function BurnModal({
  router,
  isOpen,
  onClose,
  amount,
  onOpen,
  mints,
  maxAmount,
  allMints,
  mutate,
  reset,
}: {
  router: AppRouterInstance;
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  onOpen: () => void;
  mints?: { mint: string; amount: number }[];
  maxAmount: number;
  allMints: any[];
  mutate: KeyedMutator<IGetListCarbonResponse | null>;
  reset: () => void;
}) {
  const certificateModalState = useDisclosure();
  const [manualAmount, setManualAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string | null>(null);
  return (
    <>
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
          <DCarbonButton
            color="primary"
            fullWidth
            onClick={() => {
              if (!amount) {
                if (manualAmount && Big(manualAmount).gt(Big(maxAmount))) {
                  setAmountError('Max amount to burn is ' + maxAmount);
                  return;
                }

                if (Big(manualAmount || 0).lte(0)) {
                  setAmountError('Amount must be greater than 0');
                  return;
                }
              }
              onClose();
              certificateModalState.onOpen();
            }}
          >
            Next
          </DCarbonButton>
        }
        description="Every DCO2 counts towards a net zero future. Are you ready to make a difference today?"
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
                  {Number(Big(amount).toFixed(4)).toLocaleString('en-US')} DCO2
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <NumericFormat
                    thousandSeparator
                    allowNegative={false}
                    id="you_send"
                    className={cn(
                      'text-sm w-full bg-[#E7E7E7] focus:bg-white p-3 rounded h-[40px] outline-none hover:bg-default-200 transition-all placeholder:text-[#888] placeholder:text-sm placeholder:font-normal',
                      amountError
                        ? 'ring-1 ring-danger'
                        : 'focus:ring-1 focus:ring-primary-color',
                    )}
                    placeholder="0.1"
                    decimalScale={1}
                    onValueChange={(q) => {
                      if (q?.value && Big(q?.value).gt(Big(maxAmount))) {
                        setAmountError('Max amount to burn is ' + maxAmount);
                      }

                      if (q?.value && Big(q?.value).lte(Big(maxAmount))) {
                        setAmountError(null);
                      }

                      if (Big(q?.value || 0).lte(0)) {
                        setAmountError('Amount must be greater than 0');
                      }

                      setManualAmount(q?.value || '');
                    }}
                    value={manualAmount}
                  />

                  <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                    DCO2
                  </div>
                </div>
                {amountError && (
                  <div className="text-xs text-danger">{amountError}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </DCarbonModal>
      <CertificateModal
        router={router}
        isOpen={certificateModalState.isOpen}
        onClose={certificateModalState.onClose}
        onBack={() => {
          certificateModalState.onClose();
          onOpen();
        }}
        amount={amount || Big(manualAmount || 0).toNumber()}
        mints={
          amount
            ? mints
            : generateBurningList(allMints, Big(manualAmount || 0).toNumber())
                .result || []
        }
        allMints={allMints}
        mutate={mutate}
        reset={reset}
      />
    </>
  );
}

export default BurnModal;
