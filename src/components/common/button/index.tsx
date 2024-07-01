import React, { ReactNode } from 'react';
import { Button, cn } from '@nextui-org/react';

function DCarbonButton({
  color,
  children,
  className,
  endContent,
  ...props
}: {
  color?: 'primary';
  children: React.ReactNode;
  className?: string;
  endContent?: ReactNode;
  [key: string]: any;
}) {
  return (
    <Button
      type="button"
      className={cn(
        'rounded-[4px] py-[16px] px-[32px] font-medium',
        color === 'primary' && 'bg-[#7BDA08] text-[#1B1B1B] hover:bg-[#5DAF01]',
        className,
      )}
      color={color}
      endContent={endContent}
      {...props}
    >
      {children}
    </Button>
  );
}

export default DCarbonButton;
