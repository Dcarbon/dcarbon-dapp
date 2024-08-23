'use client';

import React from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { carbonTypes, getWalletInfo } from '@/adapters/user';
import { QUERY_KEYS, WEB_ROUTES } from '@/utils/constants';
import { shortAddress } from '@/utils/helpers/common';
import {
  Button,
  Chip,
  cn,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Image,
  Link,
} from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Big } from 'big.js';
import { env } from 'env.mjs';
import arrowRight from 'public/images/common/arrow-right-wallet-button.svg';
import avatarImage from 'public/images/common/avatar.png';
import closeModal from 'public/images/common/close-modal.svg';
import dcarbonIcon from 'public/images/common/dcarbon-white.svg';
import carbonIcon from 'public/images/common/logo.svg';
import logoutImage from 'public/images/common/logout.svg';
import profileImage from 'public/images/common/profile.svg';
import solScanIcon from 'public/images/common/sol-scan.png';
import solanaExplorerIcon from 'public/images/common/solana-explorer.png';
import supportImage from 'public/images/common/support.svg';
import useSWRMutation from 'swr/mutation';

import { Skeleton } from '../loading/skeleton.component';

function ConnectedButton() {
  const { publicKey, connected, wallet, disconnect, disconnecting } =
    useWallet();
  const router = useRouter();
  const {
    trigger,
    isMutating,
    data: walletInfo,
  } = useSWRMutation(
    () => (publicKey ? [QUERY_KEYS.USER.GET_WALLET_INFO, publicKey] : null),
    ([, wallet]) => {
      if (!wallet) return;
      return getWalletInfo(wallet.toBase58());
    },
  );
  if (!publicKey || !connected || !wallet) {
    return null;
  }
  const isShowCarbonList =
    !isMutating && walletInfo?.data && walletInfo.data?.carbon_list?.length > 0;

  return (
    <Dropdown
      backdrop="blur"
      radius="md"
      classNames={{
        content: 'p-0 h-full',
        base: 'select-none',
        backdrop: 'backdrop-wallet',
      }}
      offset={-33}
      onOpenChange={async (open) => {
        try {
          if (open) {
            await trigger();
          }
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <DropdownTrigger>
        <Button
          isLoading={disconnecting}
          disableRipple
          color="primary"
          variant="flat"
          startContent={
            <Image
              src={wallet.adapter.icon}
              alt="icon"
              width={20}
              height={20}
              as={NextImage}
              radius="sm"
              className="border-1 min-w-5"
              draggable={false}
            />
          }
          type="button"
          className={cn(
            'bg-[#7BDA08] text-[#1B1B1B] hover:bg-[#5DAF01] font-medium rounded-[4px] px-2 py-1 sm:py-[16px] sm:px-[32px]',
          )}
        >
          {shortAddress('address', publicKey)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Connect menu"
        className="p-4 sm:p-[24px] min-w-[250px] sm:min-w-[348px] h-[calc(100vh-32px)] overflow-y-auto"
        disabledKeys={['address', 'wallet_balance', 'divider']}
        classNames={{
          list: 'h-full justify-start',
        }}
        defaultSelectedKeys={[]}
        hideEmptyContent
      >
        <DropdownItem
          key="close"
          className="absolute top-5 right-4 w-[44px] h-[44px] flex justify-center items-center p-[10px]"
        >
          <Image
            src={closeModal.src}
            alt="Close"
            as={NextImage}
            width={24}
            height={24}
            draggable={false}
            radius="none"
          />
        </DropdownItem>
        <DropdownItem
          isReadOnly
          key="address"
          className="opacity-100 my-1 h-fit"
        >
          <div className="flex gap-[10px] items-center">
            <Image
              src={avatarImage.src}
              alt="Avatar"
              as={NextImage}
              width={32}
              height={32}
              className="min-w-[32px]"
              radius="none"
            />

            <span>{shortAddress('address', publicKey)}</span>
          </div>
        </DropdownItem>
        <DropdownItem
          isReadOnly
          key="wallet_balance"
          className="opacity-100 h-fit"
        >
          <div className="p-4 bg-[#F6F6F6] rounded-lg flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-between flex-wrap">
              <div className="flex gap-2">
                <Image
                  src={wallet.adapter.icon}
                  width={20}
                  height={20}
                  alt="wallet"
                  radius="none"
                  as={NextImage}
                  draggable={false}
                />
                <span className="text-sm text-[#4F4F4F]">
                  {wallet.adapter.name || ''}
                </span>
              </div>

              <Chip
                className="py-[6px] px-0 text-xs leading-none h-[20px]"
                color="success"
              >
                Active
              </Chip>
            </div>

            <div className="flex gap-2 items-center">
              <Image
                src={carbonIcon.src}
                alt="Carbon"
                as={NextImage}
                width={36}
                height={36}
                draggable={false}
              />
              {isMutating ? (
                <Skeleton className="max-w-48 w-full">
                  <div className="h-[22px]"></div>
                </Skeleton>
              ) : (
                <span className="text-[22px]">
                  {Number(
                    Big(walletInfo?.data?.carbon_amount ?? 0).toFixed(4),
                  ).toLocaleString('en-US')}{' '}
                  Carbon
                </span>
              )}
            </div>
            <Divider />
            <div className="flex gap-2 items-center">
              <Image
                src={dcarbonIcon.src}
                alt="DCarbon"
                as={NextImage}
                width={36}
                height={36}
                draggable={false}
              />
              {isMutating ? (
                <Skeleton className="max-w-48 w-full">
                  <div className="h-[22px]"></div>
                </Skeleton>
              ) : (
                <span className="text-[22px]">
                  {Number(
                    Big(walletInfo?.data?.dcarbon_amount ?? 0).toFixed(4),
                  ).toLocaleString('en-US')}{' '}
                  DCarbon
                </span>
              )}
            </div>
          </div>
        </DropdownItem>
        <DropdownItem key="divider" isReadOnly className="opacity-100 h-fit">
          <Divider />
        </DropdownItem>
        {isShowCarbonList ? (
          <DropdownItem isReadOnly className="py-0 mt-2 h-fit cursor-auto">
            Amount of Carbon coins available
          </DropdownItem>
        ) : (
          <DropdownItem className="!hidden" />
        )}
        {isMutating ? (
          <DropdownSection>
            <DropdownItem
              isReadOnly
              className="w-full overflow-x-hidden py-1 mt-2"
            >
              <Skeleton>
                <div className="h-[16px]"></div>
              </Skeleton>
            </DropdownItem>
            <DropdownItem isReadOnly className="w-full overflow-x-hidden py-1">
              <Skeleton>
                <div className="h-14"></div>
              </Skeleton>
            </DropdownItem>
            <DropdownItem isReadOnly className="w-full overflow-x-hidden py-1">
              <Skeleton>
                <div className="h-14"></div>
              </Skeleton>
            </DropdownItem>
            <DropdownItem isReadOnly className="w-full overflow-x-hidden py-1">
              <Skeleton>
                <div className="h-14"></div>
              </Skeleton>
            </DropdownItem>
          </DropdownSection>
        ) : (
          <DropdownItem isReadOnly className="!hidden" />
        )}
        {isShowCarbonList && walletInfo.data ? (
          <DropdownSection>
            {walletInfo.data.carbon_list.map(
              (item: carbonTypes, index: number) => (
                <DropdownItem isReadOnly key={index} className="py-1">
                  <div className="flex justify-between p-4 bg-[#F6F6F6] rounded-lg cursor-auto">
                    <span className="text-medium font-normal">
                      {Number(Big(item.amount).toFixed(4)).toLocaleString(
                        'en-US',
                      )}{' '}
                      {' ' + item.name}
                    </span>
                    <div className="flex gap-3">
                      <Link
                        href={`https://explorer.solana.com/address/${item?.token_account || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`}
                        isExternal
                      >
                        <Image
                          src={solanaExplorerIcon.src}
                          alt="Solana Explorer"
                          as={NextImage}
                          width={24}
                          height={24}
                          draggable={false}
                          radius="none"
                          className="min-w-[24px]"
                        />
                      </Link>

                      <Link
                        href={`https://solscan.io/account/${item?.token_account || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`}
                        isExternal
                      >
                        <Image
                          src={solScanIcon.src}
                          alt="Solscan"
                          as={NextImage}
                          width={24}
                          height={24}
                          draggable={false}
                          radius="none"
                          className="min-w-[24px]"
                        />
                      </Link>
                    </div>
                  </div>
                </DropdownItem>
              ),
            )}
          </DropdownSection>
        ) : (
          <DropdownItem isReadOnly className="!hidden" />
        )}

        {
          <DropdownItem
            isReadOnly
            className="translate-y-[-10px] items-baseline justify-end cursor-auto py-1 h-fit"
          >
            <div className="flex justify-end">
              {isMutating ? (
                <Skeleton className="!max-w-16 w-full">
                  <div className="h-[14px]"></div>
                </Skeleton>
              ) : (
                <>
                  {isShowCarbonList && (
                    <Button
                      onClick={() => {
                        const backdropWalletEl = document.querySelector(
                          '.backdrop-wallet',
                        ) as any;
                        backdropWalletEl?.click && backdropWalletEl.click();
                        router.push(WEB_ROUTES.PROFILE + '?tab=list-carbon');
                      }}
                      variant="light"
                      endContent={
                        <Image
                          src={arrowRight.src}
                          alt="Arrow Right"
                          as={NextImage}
                          width={14}
                          height={14}
                          draggable={false}
                        />
                      }
                      className="hover:underline transition-all text-primary-color text-sm p-0 h-fit w-fit justify-end data-[hover=true]:bg-transparent"
                    >
                      Detail
                    </Button>
                  )}
                </>
              )}
            </div>
          </DropdownItem>
        }

        <DropdownSection className="flex-auto flex flex-col justify-end *:h-fit">
          <DropdownItem
            key="profile"
            className="flex items-center h-fit"
            startContent={
              <Image
                src={profileImage.src}
                alt="Profile"
                as={NextImage}
                width={32}
                height={32}
                draggable={false}
                radius="none"
              />
            }
            href={WEB_ROUTES.PROFILE}
          >
            Profile
          </DropdownItem>

          <DropdownItem
            key="support"
            className="h-fit"
            startContent={
              <Image
                src={supportImage.src}
                alt="Support"
                as={NextImage}
                width={32}
                height={32}
                draggable={false}
                radius="none"
              />
            }
          >
            Support
          </DropdownItem>

          <DropdownItem
            key="disconnect"
            className="h-fit"
            onClick={disconnect}
            startContent={
              <Image
                src={logoutImage.src}
                alt="Disconnect"
                as={NextImage}
                width={32}
                height={32}
                draggable={false}
                radius="none"
              />
            }
          >
            Disconnect
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

export default ConnectedButton;
