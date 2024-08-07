import { cn, Skeleton as NextUISkeleton } from '@nextui-org/react';

function Skeleton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <NextUISkeleton
      className={cn('before:!duration-[2000ms] rounded-lg', className)}
    >
      {children}
    </NextUISkeleton>
  );
}

export { Skeleton };
