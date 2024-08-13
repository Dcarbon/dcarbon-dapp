'use client';

import React, { ReactNode } from 'react';
import NextImage from 'next/image';
import {
  cn,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import closeModal from 'public/images/common/close-modal.svg';

function DCarbonModal({
  children,
  icon,
  title,
  cancelBtn,
  okBtn,
  isOpen,
  onClose,
  extra,
  hideCloseButton,
  centeredTitle,
  classNames,
  description,
  isDismissable,
}: {
  children: ReactNode;
  icon?: string;
  title: string;
  cancelBtn?: ReactNode;
  okBtn?: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  extra?: ReactNode;
  hideCloseButton?: boolean;
  centeredTitle?: boolean;
  classNames?: {
    title: string;
    body: string;
  };
  description?: string;
  isDismissable?: boolean;
}) {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      closeButton={
        <div>
          <Image
            src={closeModal.src}
            alt="Close"
            draggable={false}
            as={NextImage}
            width={24}
            height={24}
          />
        </div>
      }
      classNames={{
        closeButton: 'p-[10px] right-4 top-4 rounded-[8px]',
        base: 'max-w-[480px]',
        body: classNames?.body || '',
      }}
      radius="md"
      size="lg"
      scrollBehavior="inside"
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader
              className={cn(
                'flex flex-col gap-4',
                centeredTitle && 'items-center',
              )}
            >
              {icon && (
                <Image
                  as={NextImage}
                  alt="Icon"
                  src={icon}
                  width={66}
                  height={66}
                  draggable={false}
                  className="-translate-y-[5px]"
                />
              )}
              <div
                className={cn(
                  'flex justify-between gap-4 flex-wrap',
                  classNames?.title || '',
                )}
              >
                <div>
                  {title || ''}
                  {description && (
                    <h3 className="text-sm text-[#454545] font-light mt-[4px]">
                      {description}
                    </h3>
                  )}
                </div>
                {extra && extra}
              </div>
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter className="flex gap-6">
              {cancelBtn && cancelBtn}
              {okBtn && okBtn}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DCarbonModal;
