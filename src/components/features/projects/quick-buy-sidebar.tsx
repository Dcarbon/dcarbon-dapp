import React, { useState } from 'react';
import DCarbonButton from '@/components/common/button';
import { Input, useDisclosure } from '@nextui-org/react';

import BuyModal from './buy-modal';

function QuickBuySidebar() {
  const [credits, setCredits] = useState('0');
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <BuyModal isOpen={isOpen} onClose={onClose} />
      <div>
        <p className="text-sm font-light text-[#454545] mb-16">
          Lorem ipsum dolor sit amet consectetur. Pellentesque quis.
        </p>

        <Input
          key="credits"
          type="number"
          labelPlacement="outside"
          label="Carbon Credit"
          placeholder="0"
          radius="none"
          classNames={{
            inputWrapper: 'rounded-[4px] max-w-[408px]',
            label: '!text-[#21272A]',
          }}
          autoComplete="off"
          value={credits}
          onValueChange={setCredits}
          // isDisabled={loading}
          // isInvalid={!!email && !password}
          // errorMessage="Please enter your password!"
          // variant={!!email && !password ? 'bordered' : 'flat'}
          min={0}
        />

        <DCarbonButton
          color="primary"
          fullWidth
          className="mt-6"
          onClick={onOpen}
        >
          Buy Now
        </DCarbonButton>
      </div>
    </>
  );
}

export default QuickBuySidebar;
