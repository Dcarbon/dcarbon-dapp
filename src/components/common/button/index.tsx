import React from 'react';
import { Button, cn } from '@nextui-org/react';

function DCarbonButton({
  color,
  children,
  ...props
}: {
  color: 'primary';
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Button
      type="button"
      className={cn(
        color === 'primary' &&
          'bg-[#7BDA08] text-[#1B1B1B] hover:bg-[#5DAF01] font-medium rounded-[4px] py-[16px] px-[32px]',
      )}
      color={color}
      {...props}
    >
      {children}
    </Button>
  );
}

export default DCarbonButton;
