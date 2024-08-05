'use client';

import React from 'react';
import { useDisclosure } from '@nextui-org/react';

import DCarbonButton from '../common/button';
import SwapModal from './swap-modal';

function SwapButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <DCarbonButton
        color="primary"
        variant="bordered"
        className="px-4 py-2 sm:py-[16px] sm:px-[32px]"
        onClick={onOpen}
      >
        Swap
      </DCarbonButton>

      <SwapModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default SwapButton;
