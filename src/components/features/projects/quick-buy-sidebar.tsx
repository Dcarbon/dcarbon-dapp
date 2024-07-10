import React, { useState } from 'react';
import DCarbonButton from '@/components/common/button';
import { Input } from '@nextui-org/react';

function QuickBuySidebar() {
  const [credits, setCredits] = useState('0');
  return (
    <div>
      <p className="text-sm font-light text-[#454545] mb-16">
        Lorem ipsum dolor sit amet consectetur. Pellentesque quis.
      </p>

      <Input
        key="credits"
        type="number"
        labelPlacement="outside"
        label="Số tín chỉ"
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

      <DCarbonButton color="primary" fullWidth className="mt-6">
        Buy Now
      </DCarbonButton>
    </div>
  );
}

export default QuickBuySidebar;
