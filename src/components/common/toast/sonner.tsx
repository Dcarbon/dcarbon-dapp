'use client';

import { ReactNode } from 'react';
import NextImage from 'next/image';
import { Image } from '@nextui-org/react';
import closeIcon from 'public/images/common/close-modal.svg';
import errorIcon from 'public/images/common/error-icon.svg';
import successIcon from 'public/images/common/success-icon.svg';
import warningIcon from 'public/images/common/warning-icon.svg';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const SonnerToaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      richColors
      theme={'light'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg p-6 w-full rounded-[12px]',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

interface IShowAlert {
  title?: string;
  message?: string | ReactNode;
}

const ShowAlert = {
  error: (props?: IShowAlert) => {
    return toast.custom((t) => (
      <div className="flex flex-col gap-6 font-sans">
        <div className="flex gap-4">
          <div>
            <Image
              src={errorIcon.src}
              alt="error"
              draggable={false}
              as={NextImage}
              width={48}
              height={48}
            />
          </div>
          <div>
            <h2 className="text-lg font-medium">{props?.title || 'Error'}</h2>

            {props?.message && (
              <div
                className="font-light text-[#4F4F4F] text-sm"
                dangerouslySetInnerHTML={{ __html: props.message }}
              />
            )}
          </div>
        </div>
        <button
          className="absolute top-3 right-3 hover:bg-default-100 transition-all"
          onClick={() => toast.dismiss(t)}
        >
          <Image
            src={closeIcon.src}
            alt="close"
            as={NextImage}
            draggable={false}
            width={24}
            height={24}
          />
        </button>
      </div>
    ));
  },

  success: (props?: IShowAlert) => {
    return toast.custom((t) => (
      <div className="flex flex-col gap-6 font-sans">
        <div className="flex gap-4">
          <div>
            <Image
              src={successIcon.src}
              alt="success"
              draggable={false}
              as={NextImage}
              width={48}
              height={48}
            />
          </div>

          <div>
            <h2 className="text-lg font-medium">
              {props?.title || 'Successful'}
            </h2>

            {props?.message && (
              <div
                className="font-light text-[#4F4F4F] text-sm"
                dangerouslySetInnerHTML={{ __html: props.message }}
              />
            )}
          </div>
        </div>
        <button
          className="absolute top-3 right-3 hover:bg-default-100 transition-all"
          onClick={() => toast.dismiss(t)}
        >
          <Image
            src={closeIcon.src}
            alt="close"
            as={NextImage}
            draggable={false}
            width={24}
            height={24}
          />
        </button>
      </div>
    ));
  },

  warning: (props?: IShowAlert) => {
    return toast.error(
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 flex-col items-center">
          <div>
            <Image
              src={warningIcon}
              alt="warning"
              draggable={false}
              as={NextImage}
            />
          </div>
          <h2 className="text-2xl font-bold text-[#F8A627]">
            {props?.title || 'Warning'}
          </h2>
        </div>

        {props?.message && <div className="h-[1px] bg-black" />}

        {props?.message && (
          <div className="text-center font-medium">{props.message}</div>
        )}
      </div>,
    );
  },
};

export { ShowAlert };

export default SonnerToaster;
