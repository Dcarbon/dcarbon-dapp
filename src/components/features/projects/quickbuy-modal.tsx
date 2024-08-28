'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import NextImage from 'next/image';
import { IListingInfo } from '@/adapters/project';
import DCarbonButton from '@/components/common/button';
import { Skeleton } from '@/components/common/loading';
import DCarbonModal from '@/components/common/modal';
import { doGetMintsMetada, Metadata } from '@adapters/common';
import { cn, Image } from '@nextui-org/react';
import { PublicKey } from '@solana/web3.js';
import Big from 'big.js';
import dropdown from 'public/images/common/arrow-down-icon.svg';
import logo from 'public/images/common/logo.svg';
import swapIcon from 'public/images/projects/swap-icon.png';

type QuickBuyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  handleBuy: () => void;
  publicKey: PublicKey;
  isMinting: boolean;
};
type MetaMintsData = Metadata &
  Pick<IListingInfo, 'available' | 'payment_info'> & { name: string };
const QuickBuyModal = ({
  isOpen,
  onClose,
  data,
  handleBuy,
  publicKey,
  isMinting,
}: QuickBuyModalProps) => {
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mintsData, setMintsData] = useState<MetaMintsData[]>([]);
  const getUnitPrice = useCallback(
    async (data: any[]) => {
      setIsLoading(true);
      try {
        const mintMetadataResult = await doGetMintsMetada(
          publicKey.toBase58(),
          data.map((d) => d.mint).join(',') || '',
          true,
        );
        const MintsData = data.map(
          (d: MetaMintsData, i) =>
            ({
              ...d,
              name: mintMetadataResult?.data[i].name || '',
              symbol: mintMetadataResult?.data[i].symbol || 'USDT',
              image: mintMetadataResult?.data[i].image || '',
            }) as MetaMintsData,
        );
        setMintsData((MintsData as MetaMintsData[]) || ([] as MetaMintsData[]));
      } catch (error) {
        console.error(error);
        onClose();
      } finally {
        setIsLoading(false);
      }
    },
    [onClose, publicKey],
  );

  useEffect(() => {
    isOpen && getUnitPrice(data);
  }, [isOpen, getUnitPrice, data]);

  return (
    <DCarbonModal
      onClose={onClose}
      isOpen={isOpen}
      title="Quick buy"
      icon={swapIcon.src}
      isDismissable={false}
      cancelBtn={
        <DCarbonButton
          fullWidth
          className="bg-[#F6F6F6]"
          onClick={onClose}
          isDisabled={isMinting}
        >
          Cancel
        </DCarbonButton>
      }
      okBtn={
        <DCarbonButton
          color="primary"
          fullWidth
          onClick={handleBuy}
          isLoading={isMinting}
        >
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
            'flex flex-col gap-2 w-full mt-3 transition-height duration-1000 h-auto',
            showMore ? 'max-h-[300px] overflow-y-auto' : '',
          )}
        >
          {isLoading ? (
            <Skeleton>
              <div className="rounded bg-[#F6F6F6] h-[40px] w-full" />
            </Skeleton>
          ) : (
            <>
              {mintsData.length > 0
                ? mintsData
                    .slice(0, showMore ? mintsData.length : 5)
                    .map((d: MetaMintsData, i) => (
                      <div
                        key={i}
                        className="flex px-4 py-2 rounded items-center justify-between bg-[#F6F6F6]"
                      >
                        <div className="flex gap-2 items-center">
                          <Image
                            src={d.image || logo.src}
                            alt="logo"
                            width={24}
                            height={24}
                            as={NextImage}
                          />
                          <div className="font-normal text-text-primary flex items-center gap-1">
                            <span>{d.available}</span>
                            <span>{d.name}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 items-baseline justify-start  text-text-primary">
                          <span className="font-light text-[12px]">
                            Unit Price:
                          </span>
                          <span className="text-sm font-medium text-primary-color">
                            {' '}
                            {Number(
                              Big(
                                d.payment_info?.exchange_rate || 1 || 0,
                              ).toFixed(4),
                            ).toLocaleString('en-US')}
                            {' USDT'}
                          </span>
                        </div>
                      </div>
                    ))
                : null}
            </>
          )}
        </div>
        {isLoading ? (
          <div className="w-full flex justify-end">
            <Skeleton>
              <div className="w-24 h-[13px] rounded" />
            </Skeleton>
          </div>
        ) : (
          <>
            {data.length > 5 ? (
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
                    className={cn(
                      'transition-all',
                      showMore ? 'rotate-180' : '',
                    )}
                  />
                </span>
              </p>
            ) : null}
          </>
        )}
        {isLoading ? (
          <div className="w-full flex justify-end">
            <Skeleton>
              <div className="w-60 h-[13px] rounded" />
            </Skeleton>
          </div>
        ) : (
          <p className="flex gap-1 items-baseline justify-end font-medium">
            <span className="text-[12px] font-light text-text-primary">
              Total:
            </span>
            <span className="text-sm font-medium text-primary-color">
              {Number(
                Big(
                  data.reduce(
                    (acc, d) =>
                      acc + d.available * +(d.payment_info?.exchange_rate || 1),
                    0,
                  ),
                ).toFixed(4),
              ).toLocaleString('en-US')}
              {' USDT'}
            </span>
          </p>
        )}
      </div>
    </DCarbonModal>
  );
};

export default memo(QuickBuyModal);
