'use client';

import React from 'react';
import { useDisclosure } from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';

import DCarbonButton from '../common/button';
import SwapModal from './swap-modal';

function SwapButton({ allMints }: { allMints: any[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connected } = useWallet();
  return (
    <>
      {connected ? (
        <>
          <DCarbonButton
            color="primary"
            variant="bordered"
            className="min-w-[150px] h-[34px]"
            onClick={onOpen}
          >
            Swap
          </DCarbonButton>

          <SwapModal
            isOpen={isOpen}
            onClose={onClose}
            allMints={allMints || []}
          />
        </>
      ) : null}
    </>
  );
}

export default SwapButton;
