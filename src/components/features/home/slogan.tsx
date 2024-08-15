'use client';

import React from 'react';
import NextImage from 'next/image';
import { doSendContact, ISendContactBody } from '@/adapters/common';
import DCarbonButton from '@/components/common/button';
import { ShowAlert } from '@/components/common/toast';
import { QUERY_KEYS } from '@/utils/constants';
import { isEmpty } from '@/utils/helpers/common';
import {
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { motion } from 'framer-motion';
import arrowRightButtonImage from 'public/images/home/arrow-right-button.svg';
import useSWRMutation from 'swr/mutation';

type FormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};
function Slogan() {
  const [fields, setFields] = React.useState<FormDataType>({} as FormDataType);
  const [error, setError] = React.useState<FormDataType>({} as FormDataType);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { trigger, isMutating } = useSWRMutation(
    [QUERY_KEYS.COMMON.SEND_CONTACT],
    (_, { arg }: { arg: ISendContactBody }) => {
      return doSendContact(arg);
    },
    {
      onSuccess: () => {
        ShowAlert.success({
          message: 'Your message has been sent successfully!',
        });
        setFields({} as FormDataType);
        setError({} as FormDataType);
        onOpenChange();
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const handleSubmit = () => {
    const { firstName, lastName, email, message } = fields;
    const error = {} as FormDataType;
    if (!firstName) {
      error['firstName'] = 'Please enter your first name!';
    }
    if (!lastName) {
      error['lastName'] = 'Please enter your last name!';
    }
    if (!email) {
      error['email'] = 'Please enter your email!';
    } else if (!validateEmail(email)) {
      error['email'] = 'Please enter a valid email!';
    }
    if (!message) {
      error['message'] = 'Please enter your message!';
    }
    setError(error);
    if (isEmpty(error)) {
      trigger({
        firstName,
        lastName,
        email,
        message: JSON.stringify(message).replace(/"/g, ''),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <motion.h2
        className="text-2xl sm:text-5xl font-semibold text-center"
        initial={{ opacity: 0, y: -80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
        }}
      >
        <span className="text-primary-color">DCarbon</span> a Trustless and{' '}
        <br /> autonomous Carbon system
      </motion.h2>

      <motion.p
        className="text-[#d9d9d9] text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
        }}
      >
        Accurately measure, report and verify carbon footprints reduced, then{' '}
        <br /> bring them to the blockchains.
      </motion.p>

      <motion.div
        className="flex"
        initial={{ opacity: 0, y: 53 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
        }}
      >
        <DCarbonButton
          color="primary"
          className="mt-[11px] h-[53px] mx-auto"
          onPress={onOpen}
          endContent={
            <Image
              src={arrowRightButtonImage.src}
              width={20}
              height={20}
              as={NextImage}
              alt="Arrow Right"
              radius="none"
              draggable={false}
            />
          }
        >
          Get in touch
        </DCarbonButton>
      </motion.div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => {
            return (
              <>
                <ModalHeader className="font-bold text-3xl">
                  Say Hello<span className="text-primary-color">.</span>
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="First name"
                    key="firstName"
                    isInvalid={!!error.firstName}
                    errorMessage={error.firstName}
                    value={fields.firstName}
                    onValueChange={(value) => {
                      setFields({ ...fields, firstName: value });
                      setError({ ...error, firstName: '' });
                    }}
                    variant={error.firstName ? 'bordered' : 'flat'}
                    classNames={{
                      inputWrapper:
                        'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
                      label: '!text-[#21272A]',
                      helperWrapper: 'px-0',
                    }}
                    color={error.firstName ? 'danger' : 'success'}
                    required
                    className="mb-4"
                  />
                  <Input
                    label="Last name"
                    key="lastName"
                    isInvalid={!!error.lastName}
                    errorMessage={error.lastName}
                    value={fields.lastName}
                    color={error.lastName ? 'danger' : 'success'}
                    onValueChange={(value) => {
                      setFields({ ...fields, lastName: value });
                      setError({ ...error, lastName: '' });
                    }}
                    variant={error.lastName ? 'bordered' : 'flat'}
                    classNames={{
                      inputWrapper:
                        'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
                      label: '!text-[#21272A]',
                      helperWrapper: 'px-0',
                    }}
                    required
                    className="mb-4"
                  />
                  <Input
                    label="Email"
                    key="email"
                    type="email"
                    color={error.email ? 'danger' : 'success'}
                    isInvalid={!!error.email}
                    errorMessage={error.email}
                    value={fields.email}
                    onValueChange={(value) => {
                      setFields({ ...fields, email: value });
                      if (!validateEmail(value)) {
                        setError({
                          ...error,
                          email: 'Please enter a valid email!',
                        });
                      } else {
                        setError({ ...error, email: '' });
                      }
                    }}
                    classNames={{
                      inputWrapper:
                        'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
                      label: '!text-[#21272A]',
                      helperWrapper: 'px-0',
                    }}
                    required
                    variant={error.email ? 'bordered' : 'flat'}
                    className="mb-4"
                  />
                  <Textarea
                    key="message"
                    color={error.message ? 'danger' : 'success'}
                    label="Message"
                    isInvalid={!!error.message}
                    errorMessage={error.message}
                    value={fields.message}
                    onValueChange={(value) => {
                      setFields({ ...fields, message: value });
                      setError({ ...error, message: '' });
                    }}
                    classNames={{
                      inputWrapper:
                        'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color',
                      label: '!text-[#21272A]',
                      helperWrapper: 'px-0',
                    }}
                    variant={error.message ? 'bordered' : 'flat'}
                    required
                    className="mb-4"
                  />
                </ModalBody>
                <ModalFooter className="justify-between">
                  <Link
                    href="https://calendly.com/tunguyen-m1db/30min"
                    isExternal
                  >
                    <DCarbonButton
                      variant="bordered"
                      color="primary"
                      onPress={onClose}
                    >
                      Book A Call
                    </DCarbonButton>
                  </Link>
                  <DCarbonButton
                    color="primary"
                    onPress={handleSubmit}
                    isLoading={isMutating}
                  >
                    Send
                  </DCarbonButton>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Slogan;
