'use client';

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { WEB_ROUTES } from '@/utils/constants';
import {
  cn,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import logo from 'public/images/common/logo.png';

import ConnectButton from './button/connect-button';

function Header() {
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [isHideNavbar, setHideNavbar] = useState(false);
  useEffect(() => {
    const debounceHandleScroll = () => {
      let timer: NodeJS.Timeout;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const currentScrollPos = window.scrollY;
          if (currentScrollPos > currentScrollPosition) {
            setHideNavbar(true);
          } else {
            setHideNavbar(false);
          }
          setCurrentScrollPosition(currentScrollPos);
        }, 200);
      };
    };

    const debouncedScroll = debounceHandleScroll();

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', debouncedScroll);
    }

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, [currentScrollPosition]);
  return (
    <Navbar
      isBlurred={currentScrollPosition !== 0}
      height={60}
      maxWidth="full"
      classNames={{
        item: [
          'flex',
          'relative',
          'h-full',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
        base: cn(
          'lg:px-[64px] py-[10px] overflow-hidden fixed bg-transparent transition-all',
          isHideNavbar ? 'translate-y-[-95px]' : 'translate-y-0',
        ),
        wrapper: 'p-4 lg:p-0',
      }}
    >
      <NavbarBrand>
        <Link href={WEB_ROUTES.HOME}>
          <Image
            className="min-w-8"
            src={logo.src}
            alt="logo"
            as={NextImage}
            width={32}
            height={32}
            draggable={false}
          />
          <p className="font-bold ml-[10px] text-white">DCARBON</p>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <ConnectButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default Header;
