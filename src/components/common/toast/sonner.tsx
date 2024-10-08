'use client';

import { ReactNode } from 'react';
import NextImage from 'next/image';
import { Image, Spinner } from '@nextui-org/react';
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
      visibleToasts={1}
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
  body?: ReactNode;
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
            {props?.body && (
              <div className="font-light text-[#4F4F4F] text-sm">
                {props?.body}
              </div>
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
            {props?.body && (
              <div className="font-light text-[#4F4F4F] text-sm">
                props?.body
              </div>
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
    return toast.custom((t) => (
      <div className="flex flex-col gap-6 font-sans">
        <div className="flex gap-4">
          <div>
            <Image
              src={warningIcon.src}
              alt="warning"
              draggable={false}
              as={NextImage}
              width={48}
              height={48}
            />
          </div>

          <div>
            <h2 className="text-lg font-medium">{props?.title || 'Warning'}</h2>

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

  loading: (props: any) => {
    return toast.loading(
      <div className="flex flex-col gap-6 font-sans">
        <div className="flex gap-4">
          <div>
            <Spinner color="success" />
          </div>

          <div>
            <h2 className="text-lg font-medium">
              {props?.title || 'Processing'}
            </h2>

            {props?.message && (
              <div
                className="font-light text-[#4F4F4F] text-sm"
                dangerouslySetInnerHTML={{ __html: props.message }}
              />
            )}
          </div>
        </div>
      </div>,
      { id: 'loading' },
    );
  },
  dismiss: (id?: string) => {
    let counter = 0;
    const idInterval = setInterval(() => {
      if (counter > 10) {
        clearInterval(idInterval);
        return;
      }
      if (id) {
        toast.dismiss(id);
        counter++;
        return;
      }
      toast.dismiss();
      counter++;
    }, 1000);
  },
};

export { ShowAlert };

export default SonnerToaster;
