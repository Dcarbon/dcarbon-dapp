import React from 'react';
import NextImage from 'next/image';
import {
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import logo from 'public/images/common/logo.png';

import ConnectButton from './button/connect-button';

function Header() {
  return (
    <Navbar
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
        base: 'px-[64px] py-[10px] h-[60px] overflow-hidden',
      }}
    >
      <NavbarBrand>
        <Image
          src={logo.src}
          alt="logo"
          as={NextImage}
          width={32}
          height={32}
          draggable={false}
        />
        <p className="font-bold text-inherit ml-[10px]">DCARBON</p>
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
