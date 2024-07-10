'use client';

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
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
import fullLogoImage from 'public/images/common/full-logo.svg';

import ConnectButton from './button/connect-button';

function Header() {
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [isHideNavbar, setHideNavbar] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== WEB_ROUTES.HOME
    ) {
      return;
    }

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
          'lg:px-[64px] py-[10px] overflow-hidden transition-all mb-[-92px] lg:mb-[-60px]',
          isHideNavbar ? 'translate-y-[-95px]' : 'translate-y-0',
          pathName === WEB_ROUTES.HOME ? 'bg-transparent' : 'bg-white',
        ),
        wrapper: 'px-4 lg:p-0',
      }}
    >
      <NavbarBrand>
        <Link href={WEB_ROUTES.HOME}>
          <Image
            className="min-w-[164px]"
            src={fullLogoImage.src}
            alt="logo"
            as={NextImage}
            width={164}
            height={32}
            draggable={false}
          />
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
