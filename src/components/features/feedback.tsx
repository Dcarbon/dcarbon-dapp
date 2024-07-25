'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { cn, Image, Textarea, useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import amazingEmoji from 'public/images/home/amazing-emoji.svg';
import badEmoji from 'public/images/home/bad-emoji.svg';
import emojiShadow from 'public/images/home/emoji-shadow.svg';
import goodEmoji from 'public/images/home/good-emoji.svg';
import okeyEmoji from 'public/images/home/okey-emoji.svg';
import terribleEmoji from 'public/images/home/terrible-emoji.svg';

import DCarbonButton from '../common/button';
import DCarbonModal from '../common/modal';

function FeedbackModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feedback, setFeedback] = useState<string[]>([]);
  const [hovering, setHovering] = useState('');

  const emoji = [
    { name: 'Terrible', icon: terribleEmoji.src },
    { name: 'Bad', icon: badEmoji.src },
    { name: 'Okey', icon: okeyEmoji.src },
    { name: 'Good', icon: goodEmoji.src },
    { name: 'Amazing', icon: amazingEmoji.src },
  ];

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
          <DCarbonButton color="primary" fullWidth>
            Submit
          </DCarbonButton>
        }
      >
        <div className="flex flex-wrap gap-2 pb-3">
          {emoji.map((item, index) => (
            <button
              className={cn(
                'w-[80px] h-[92px] bg-white border-1 border-[#E4E7EC] flex justify-center items-center rounded-lg p-4 flex-col hover',
                feedback.includes(item.name) &&
                  'border-[#5DAF01] shadow-[0px_7px_14px_0px_#3F730045] transition-all',
              )}
              key={index}
              onClick={() => {
                if (feedback.includes(item.name)) {
                  setFeedback(feedback.filter((i) => i !== item.name));
                  return;
                }
                setFeedback([...feedback, item.name]);
              }}
              onMouseEnter={() => setHovering(item.name)}
              onMouseLeave={() => setHovering('')}
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
          />
        </div>
      </DCarbonModal>
    </>
  );
}

export default FeedbackModal;
