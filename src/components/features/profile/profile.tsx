'use client';

import React from 'react';
import NextImage from 'next/image';
import { doGetProfile } from '@/adapters/user';
import DCarbonButton from '@/components/common/button';
import { Skeleton } from '@/components/common/loading';
import { ShowAlert } from '@/components/common/toast';
import { QUERY_KEYS } from '@/utils/constants';
import { Avatar, Image } from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import Big from 'big.js';
import avatar from 'public/images/certificates/avatar.png';
import cameraIcon from 'public/images/certificates/camera.svg';
import editIcon from 'public/images/certificates/edit.svg';
import copyIcon from 'public/images/common/copy.svg';
import useSWR from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';

function CertificateProfile() {
  const [, copy] = useCopyToClipboard();
  const { publicKey } = useWallet();
  const { data, isLoading } = useSWR(
    () => (publicKey ? [QUERY_KEYS.USER.GET_PROFILE_INFO, publicKey] : null),
    ([, publicKey]) => {
      return publicKey ? doGetProfile(publicKey.toBase58()) : null;
    },
    {
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );
  const shortWalletAddress =
    (publicKey?.toBase58()?.slice(0, 5) || '') +
    '...' +
    (publicKey?.toBase58()?.slice(-5) || '');
  return (
    <div className="pt-[46px] px-[32px] pb-[41px] bg-white rounded-lg w-full lg:max-w-[408px] flex flex-col items-center gap-8">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar
            isBordered
            src={avatar.src}
            ImgComponent={NextImage}
            imgProps={{
              width: 160,
              height: 160,
              draggable: false,
              alt: 'Avatar',
            }}
            classNames={{
              base: 'w-[166px] h-[166px] ring-primary-color',
            }}
          />

          <div className="w-12 h-12 rounded-full bg-white shadow-[2px_4px_8px_0px_#0000001A] flex justify-center items-center absolute right-0 bottom-0">
            <Image
              src={cameraIcon.src}
              alt="upload avatar"
              as={NextImage}
              width={24}
              height={24}
              draggable={false}
              radius="none"
            />
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="mt-7">
            <div className="h-[18px] w-48" />
          </Skeleton>
        ) : (
          <h1 className="text-lg font-medium mt-4">
            {data?.data?.name || 'Unnamed'}
          </h1>
        )}
        <div className="mt-[10px] text-sm font-light flex gap-[5px]">
          <span>{publicKey ? shortWalletAddress : ''}</span>
          <button
            onClick={async () => {
              await copy(publicKey?.toBase58() || '');
              ShowAlert.success({ message: 'Copied to clipboard' });
            }}
          >
            <Image
              src={copyIcon.src}
              alt="Copy"
              width={20}
              height={20}
              as={NextImage}
              draggable={false}
            />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="p-4 bg-[#F6F6F6] w-full flex gap-6 justify-between h-[52px] rounded-lg items-center">
          <div className="font-light">Funded</div>
          {isLoading ? (
            <Skeleton>
              <div className="max-w-24 min-w-8 w-full h-[16px]" />
            </Skeleton>
          ) : (
            <div className="font-medium text-nowrap">
              {Number(Big(data?.data?.funded || 0).toFixed(1)).toLocaleString(
                'en-US',
              )}{' '}
              USD
            </div>
          )}
        </div>

        <div className="p-4 bg-[#F6F6F6] w-full flex gap-6 justify-between h-[52px] rounded-lg items-center">
          <div className="font-light">Offset</div>
          {isLoading ? (
            <Skeleton>
              <div className="h-[16px] max-w-24 min-w-8 w-full" />
            </Skeleton>
          ) : (
            <div className="font-medium text-nowrap">
              {Number(Big(data?.data?.offset || 0).toFixed(1)).toLocaleString(
                'en-US',
              )}{' '}
              DCO2
            </div>
          )}
        </div>
      </div>

      <DCarbonButton
        color="primary"
        fullWidth
        startContent={
          <Image
            src={editIcon.src}
            alt="edit"
            as={NextImage}
            width={20}
            height={20}
            radius="none"
          />
        }
      >
        Edit Profile
      </DCarbonButton>
    </div>
  );
}

export default CertificateProfile;
