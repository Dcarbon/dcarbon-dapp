import React from 'react';
import NextImage from 'next/image';
import {
  Button,
  Chip,
  cn,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import avatarImage from 'public/images/common/avatar.png';
import closeModal from 'public/images/common/close-modal.svg';
import logoutImage from 'public/images/common/logout.svg';
import profileImage from 'public/images/common/profile.svg';
import supportImage from 'public/images/common/support.svg';

function ConnectedButton() {
  const { publicKey, connected, wallet, disconnect, disconnecting } =
    useWallet();

  if (!publicKey || !connected || !wallet) {
    return null;
  }

  const shortWalletAddress =
    (publicKey?.toBase58()?.slice(0, 5) || '') +
    '...' +
    (publicKey?.toBase58()?.slice(-5) || '');

  return (
    <Dropdown
      backdrop="blur"
      radius="md"
      classNames={{
        content: 'p-0',
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
          {shortWalletAddress}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Connect menu"
        className="p-4 sm:p-[24px] min-w-[250px] sm:min-w-[348px]"
        disabledKeys={['address', 'wallet_balance', 'divider']}
        classNames={{
          list: 'gap-4',
        }}
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
        <DropdownItem isReadOnly key="address" className="opacity-100 my-1">
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

            <span>{shortWalletAddress}</span>
          </div>
        </DropdownItem>
        <DropdownItem isReadOnly key="wallet_balance" className="opacity-100">
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

            <div className="flex flex-col gap-2">
              <span className="text-[22px]">100 DCarbon</span>
              <span className="text-sm text-[#4F4F4F] font-light">
                ≈ 10 ETH
              </span>
            </div>
          </div>
        </DropdownItem>
        <DropdownItem key="divider" isReadOnly className="opacity-100">
          <Divider />
        </DropdownItem>

        <DropdownItem
          key="profile"
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
        >
          Profile
        </DropdownItem>

        <DropdownItem
          key="support"
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
      </DropdownMenu>
    </Dropdown>
  );
}

export default ConnectedButton;
