'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn, Image, Tab, Tabs } from '@nextui-org/react';
import { motion } from 'framer-motion';
import closeIcon from 'public/images/common/close-modal.svg';
import menuIcon from 'public/images/common/menu.svg';
import { useOnClickOutside, useScrollLock } from 'usehooks-ts';

import ProjectListSidebar from './project-list-sidebar';
import QuickBuySidebar from './quick-buy-sidebar';

const sidebar = {
  hidden: { opacity: 0, transform: 'translateX(300px)' },
  show: {
    opacity: 1,
    transform: 'translateX(0px)',
  },
};

const backdrop = {
  hidden: { opacity: 0, display: 'none' },
  show: { opacity: 1, display: 'block' },
};

function Sidebar() {
  const [isOpen, toggleOpen] = useState(false);
  const { lock, unlock } = useScrollLock({
    autoLock: false,
  });
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const [tab, setTab] = useState<string>(
    mode === 'quick-buy' ? mode : 'list-project',
  );

  const asideRef = useRef(null);
  const menuBtnRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleClickOutside = useCallback(() => {
    toggleOpen(false);
  }, []);

  useOnClickOutside([asideRef, menuBtnRef], handleClickOutside);

  useEffect(() => {
    if (isOpen) {
      lock();
      return;
    }
    unlock();
    return () => {
      unlock();
    };
  }, [isOpen]);

  const handleToggleOpen = useCallback((value: boolean) => {
    toggleOpen(!value);
  }, []);

  return (
    <>
      <motion.aside
        className={cn(
          'fixed top-0 right-0 bottom-0 w-[300px] z-50 xl:z-20 bg-white px-4 xl:px-6 py-12 xl:sticky xl:top-[60px] xl:self-start xl:max-w-[408px] xl:!opacity-100 xl:!translate-x-0 xl:w-full xl:p-0 overflow-x-hidden overflow-y-auto xl:overflow-visible',
        )}
        ref={asideRef}
        variants={sidebar}
        initial="hidden"
        animate={isOpen ? 'show' : 'hidden'}
      >
        <Tabs
          key="mode"
          variant="light"
          aria-label="Projects Mode"
          classNames={{
            tab: 'h-[49px]',
            cursor: 'shadow-none bg-[#F6F6F6]',
            tabContent:
              'xl:text-[23px] font-medium group-data-[selected=true]:text-[#21272A]',
            tabList: 'p-0',
            panel: 'py-[32px]',
          }}
          fullWidth
          selectedKey={tab}
          onSelectionChange={(key) => {
            const params = new URLSearchParams(searchParams.toString());

            if (key.toString() === 'quick-buy') {
              params.set('mode', key.toString());
            } else {
              params.delete('mode');
            }

            setTab(key.toString());
            router.push(pathname + '?' + params.toString());
          }}
        >
          <Tab key="quick-buy" title="Quick Buy">
            <QuickBuySidebar />
          </Tab>
          <Tab key="list-project" title="List Project">
            <ProjectListSidebar />
          </Tab>
        </Tabs>
        <button
          className="absolute top-4 right-4 hover:bg-default-100 transition-all xl:hidden"
          onClick={() => handleClickOutside()}
        >
          <Image
            src={closeIcon.src}
            alt="close"
            as={NextImage}
            width={24}
            height={24}
            draggable={false}
          />
        </button>
      </motion.aside>
      <button
        ref={menuBtnRef}
        onClick={() => handleToggleOpen(isOpen)}
        className={cn(
          'bg-primary-color fixed right-0 top-[20%] z-10 p-2 rounded-tl-lg rounded-bl-lg xl:hidden',
          isOpen ? 'hidden' : 'block',
        )}
      >
        <Image
          src={menuIcon.src}
          as={NextImage}
          alt="Menu"
          width={24}
          height={24}
          draggable={false}
          radius="none"
        />
      </button>
      <motion.div
        className={cn(
          'z-40 backdrop-blur-md backdrop-saturate-150 bg-overlay/30 w-screen h-screen fixed inset-0 xl:hidden',
        )}
        variants={backdrop}
        initial="hidden"
        animate={isOpen ? 'show' : 'hidden'}
      />
    </>
  );
}

export default Sidebar;
