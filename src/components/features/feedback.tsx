'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { doSendFeedback, ISendFeedbackBody, TFeeling } from '@/adapters/common';
import { QUERY_KEYS, THROW_EXCEPTION } from '@/utils/constants';
import { cn, Image, Input, Textarea, useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import amazingEmoji from 'public/images/home/amazing-emoji.svg';
import badEmoji from 'public/images/home/bad-emoji.svg';
import emojiShadow from 'public/images/home/emoji-shadow.svg';
import goodEmoji from 'public/images/home/good-emoji.svg';
import okeyEmoji from 'public/images/home/okey-emoji.svg';
import terribleEmoji from 'public/images/home/terrible-emoji.svg';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';

import DCarbonButton from '../common/button';
import DCarbonModal from '../common/modal';
import { ShowAlert } from '../common/toast';

function FeedbackModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feeling, setFeeling] = useState<TFeeling>();
  const [hovering, setHovering] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const isInvalidEmail = email
    ? !z.string().email().safeParse(email).success
    : false;

  const emoji = [
    { name: 'Terrible' as const, icon: terribleEmoji.src },
    { name: 'Bad' as const, icon: badEmoji.src },
    { name: 'Okey' as const, icon: okeyEmoji.src },
    { name: 'Good' as const, icon: goodEmoji.src },
    { name: 'Amazing' as const, icon: amazingEmoji.src },
  ];

  const { trigger, isMutating } = useSWRMutation(
    [QUERY_KEYS.COMMON.SEND_FEEDBACK],
    (_, { arg }: { arg: ISendFeedbackBody }) => {
      return doSendFeedback(arg);
    },
  );

  return (
    <>
      <button className="py-3 px-2 text-sm text-[#C8C8C8]" onClick={onOpen}>
        Feedback
      </button>
      <DCarbonModal
        title="Give feedback"
        isOpen={isOpen}
        onClose={onClose}
        description="What do you think about your experience using Dcarbon?"
        cancelBtn={
          <DCarbonButton fullWidth className="bg-[#F6F6F6]" onClick={onClose}>
            Cancel
          </DCarbonButton>
        }
        okBtn={
          <DCarbonButton
            color="primary"
            fullWidth
            onClick={async () => {
              if (!feeling) {
                ShowAlert.error({ message: 'Please select a feeling!' });
                return;
              }

              if (!name) {
                ShowAlert.error({ message: 'Please enter your name!' });
                return;
              }

              if (!email) {
                ShowAlert.error({ message: 'Please enter your email!' });
                return;
              }

              try {
                const data = (await trigger({
                  feeling,
                  name,
                  email,
                  description: JSON.stringify(description).replace(/"/g, ''),
                })) as any;

                if (data?.statusCode === 400) {
                  ShowAlert.error({
                    message:
                      (Array.isArray(data?.message)
                        ? data?.message?.join('<br />')
                        : data?.message) || THROW_EXCEPTION.UNKNOWN,
                  });
                  return;
                }

                ShowAlert.success({
                  message: 'Thank you for your feedback!',
                });

                onClose();

                setFeeling(undefined);
                setEmail('');
                setName('');
                setDescription('');
              } catch (e) {
                const error = e as Error;
                console.error(error.message || '');
                ShowAlert.error({
                  message: THROW_EXCEPTION.UNKNOWN,
                });
              }
            }}
            isLoading={isMutating}
          >
            Submit
          </DCarbonButton>
        }
      >
        <div className="flex flex-wrap gap-2 pb-3">
          {emoji.map((item, index) => (
            <button
              className={cn(
                'w-[80px] h-[92px] bg-white border-1 border-[#E4E7EC] flex justify-center items-center rounded-lg p-4 flex-col hover',
                feeling === item.name &&
                  'border-[#5DAF01] shadow-[0px_7px_14px_0px_#3F730045] transition-all',
              )}
              key={index}
              onClick={() => {
                if (feeling === item.name) {
                  setFeeling(undefined);
                  return;
                }
                setFeeling(item.name);
              }}
              onMouseEnter={() => setHovering(item.name)}
              onMouseLeave={() => setHovering('')}
              disabled={isMutating}
            >
              <div className="min-w-8 min-h-8">
                <motion.div
                  animate={{
                    scale: hovering === item.name ? 1.2 : 1,
                    x: hovering === item.name ? [-5, 0, 0, 5] : 0,
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: hovering === item.name ? Infinity : 0,
                    repeatType: 'reverse',
                  }}
                >
                  <Image
                    src={item.icon}
                    alt="Emoji"
                    width={32}
                    height={32}
                    as={NextImage}
                    draggable={false}
                  />
                </motion.div>

                <Image
                  src={emojiShadow.src}
                  alt="Emoji Shadow"
                  width={32}
                  height={3}
                  as={NextImage}
                  draggable={false}
                />
              </div>
              <span className="font-light text-sm text-[#4F4F4F]">
                {item.name}
              </span>
            </button>
          ))}
        </div>

        <div>
          <Input
            key="name"
            type="text"
            labelPlacement="outside"
            label="Name"
            placeholder="Your name"
            radius="none"
            classNames={{
              inputWrapper: cn(
                'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color w-full',
              ),
              label: '!text-[#21272A]',
              helperWrapper: 'px-0',
            }}
            autoComplete="off"
            errorMessage="Please enter your name!"
            variant={'flat'}
            value={name}
            onValueChange={setName}
            isDisabled={isMutating}
            isRequired
          />
        </div>

        <div>
          <Input
            key="email"
            type="email"
            labelPlacement="outside"
            label="Email"
            placeholder="Your email address"
            radius="none"
            classNames={{
              inputWrapper: cn(
                'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color w-full',
                isInvalidEmail && 'group-data-[focus=true]:ring-0',
              ),
              label: '!text-[#21272A]',
              helperWrapper: 'px-0',
            }}
            autoComplete="off"
            isInvalid={isInvalidEmail}
            errorMessage="Please enter a valid email!"
            variant={isInvalidEmail ? 'bordered' : 'flat'}
            value={email}
            onValueChange={setEmail}
            isDisabled={isMutating}
            isRequired
          />
        </div>

        <div className="mb-2">
          <Textarea
            label="What are the main reasons for your rating?"
            placeholder=""
            labelPlacement="outside"
            classNames={{
              label: '!text-[#21272A] font-normal',
              inputWrapper:
                'rounded-[4px] bg-[#F6F6F6] data-[focus=true]:border-1 data-[focus=true]:border-primary-color data-[focus=true]:!bg-white',
            }}
            value={description}
            onValueChange={setDescription}
            disabled={isMutating}
          />
        </div>
      </DCarbonModal>
    </>
  );
}

export default FeedbackModal;
