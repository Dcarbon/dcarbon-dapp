import React, { useState } from 'react';
import DCarbonButton from '@/components/common/button';
import { Input } from '@nextui-org/react';

function QuickBuySidebar() {
  const [credits, setCredits] = useState('0');
  return (
    <>
      <div>
        <p className="text-sm font-light text-[#454545] mb-16">
          Purchase credits from any of our farms.
        </p>

        <Input
          key="credits"
          type="number"
          labelPlacement="outside"
          label="Carbon Credit"
          placeholder="0"
          radius="none"
          classNames={{
            inputWrapper:
              'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
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

        <DCarbonButton color="primary" fullWidth className="mt-6">
          Buy Now
        </DCarbonButton>
      </div>
    </>
  );
}

export default QuickBuySidebar;
