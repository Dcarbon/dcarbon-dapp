'use client';

import React from 'react';
import NextImage from 'next/image';
import {
  Chip,
  cn,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import arrowRightWalletButton from 'public/images/common/arrow-right-wallet-button.svg';
import closeModal from 'public/images/common/close-modal.svg';
import walletsImage from 'public/images/common/wallets.svg';

import DCarbonButton from '.';

function WalletButton({
  select,
  onClose,
  state,
}: {
  select: (walletName: WalletName | null) => void;
  onClose: () => void;
  state: Wallet;
}) {
  return (
    <button
      className="p-4 border-1 border-color-[#E4E7EC] rounded-[12px]"
      key={state.adapter.name}
      onClick={async () => {
        try {
          select(state.adapter.name);
        } catch (e) {
          console.error(e);
        } finally {
          onClose();
        }
      }}
    >
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="min-w-[32px]">
            <Image
              src={state.adapter.icon}
              alt={state.adapter.name}
              height={32}
              width={32}
              as={NextImage}
              radius="sm"
              className={cn(
                state.adapter.name !== 'Phantom' && 'border-1 p-1',
                state.adapter.name === 'Solflare' && 'bg-[#30344f]',
              )}
            />
          </div>
          <div className="flex flex-col justify-start items-start">
            {state.adapter.name}
            {state.adapter.name === 'Phantom' && (
              <Chip
                classNames={{
                  base: 'bg-[#00DEF21A]',
                  content: 'font-light text-[12px] px-[6px]',
                }}
              >
                Recommended
              </Chip>
            )}
          </div>
        </div>

        <div className="flex gap-1 items-center justify-center">
          <div className="hidden sm:flex items-center">
            {state.readyState === WalletReadyState.Installed ? (
              state.adapter.connected ? (
                <Chip
                  color="success"
                  classNames={{
                    base: 'rounded-[4px] h-[22px]',
                    content: 'text-[12px] p-[6px] text-white leading-none',
                  }}
                >
                  Connected
                </Chip>
              ) : (
                <Chip
                  color="warning"
                  classNames={{
                    base: 'rounded-[4px] h-[22px]',
                    content: 'text-[12px] p-[6px] text-white leading-none',
                  }}
                >
                  Detected
                </Chip>
              )
            ) : (
              <Chip
                color="danger"
                classNames={{
                  base: 'rounded-[4px] h-[22px]',
                  content: 'text-[12px] p-[6px] text-white leading-none',
                }}
              >
                Not Installed
              </Chip>
            )}
          </div>
          <div className="flex items-center">
            <Image
              src={arrowRightWalletButton.src}
              alt="arrow right"
              as={NextImage}
              draggable={false}
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function NotConnectButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { wallets, select, connecting } = useWallet();

  if (connecting) {
    return (
      <DCarbonButton
        color="primary"
        variant="flat"
        isLoading={true}
        className="px-4 py-2 sm:py-[16px] sm:px-[32px]"
      >
        Connecting
      </DCarbonButton>
    );
  }

  return (
    <>
      <DCarbonButton
        color="primary"
        variant="flat"
        onClick={onOpen}
        className="px-4 py-2 sm:py-[16px] sm:px-[32px]"
      >
        Connect Wallet
      </DCarbonButton>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        closeButton={
          <div>
            <Image
              src={closeModal.src}
              alt="Close"
              draggable={false}
              as={NextImage}
              width={24}
              height={24}
            />
          </div>
        }
        classNames={{
          closeButton: 'p-[10px] right-4 top-4 rounded-[8px]',
        }}
        radius="md"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4">
                <Image
                  as={NextImage}
                  alt="wallets"
                  src={walletsImage.src}
                  width={48}
                  height={48}
                  draggable={false}
                />
                Connect Wallet
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5">
                  {wallets
                    .filter((wl) =>
                      ['Phantom', 'Backpack', 'Solflare'].includes(
                        wl.adapter.name,
                      ),
                    )
                    .map((wl) => {
                      return (
                        <WalletButton
                          state={wl}
                          key={wl.adapter.name}
                          select={select}
                          onClose={onClose}
                        />
                      );
                    })}
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default NotConnectButton;
