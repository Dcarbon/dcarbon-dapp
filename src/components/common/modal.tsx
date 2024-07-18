'use client';

import React, { ReactNode } from 'react';
import NextImage from 'next/image';
import {
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
}: {
  children: ReactNode;
  icon?: string;
  title: string;
  cancelBtn?: ReactNode;
  okBtn?: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  extra?: ReactNode;
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
      }}
      radius="md"
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-4">
              {icon && (
                <Image
                  as={NextImage}
                  alt="Icon"
                  src={icon}
                  width={54}
                  height={54}
                  draggable={false}
                />
              )}
              <div className="flex justify-between gap-4 flex-wrap">
                {title || ''}
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
