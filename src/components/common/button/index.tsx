import React, { ReactNode } from 'react';
import { Button, cn } from '@nextui-org/react';

function DCarbonButton({
  color,
  children,
  className,
  endContent,
  startContent,
  isLoading,
  ...props
}: {
  color?: 'primary';
  children: React.ReactNode;
  className?: string;
  endContent?: ReactNode;
  startContent?: ReactNode;
  isLoading?: boolean;
  [key: string]: any;
}) {
  return (
    <Button
      type="button"
      className={cn(
        'rounded-[4px] py-[16px] px-[32px] font-medium data-[disabled=true]:bg-[#D1D1D1] data-[disabled=true]:opacity-100 data-[disabled=true]:!text-[#888]',
        color === 'primary' && 'bg-[#7BDA08] text-[#1B1B1B] hover:bg-[#5DAF01]',
        className,
      )}
      color={color}
      endContent={endContent}
      startContent={startContent}
      isLoading={isLoading}
      {...props}
    >
      {children}
    </Button>
  );
}

export default DCarbonButton;
