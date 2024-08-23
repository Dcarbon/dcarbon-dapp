'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { doSignIn } from '@/adapters/auth';
import { THROW_EXCEPTION } from '@/utils/constants';
import {
  Accordion,
  AccordionItem,
  Chip,
  cn,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import { env } from 'env.mjs';
import arrowRightWalletButton from 'public/images/common/arrow-right-wallet-button.svg';
import closeModal from 'public/images/common/close-modal.svg';
import eyeClose from 'public/images/common/eye-close.svg';
import eyeOpen from 'public/images/common/eye-open.svg';
import walletsImage from 'public/images/common/wallets.png';

import DCarbonButton from '.';
import { ShowAlert } from '../toast';

function WalletButton({
  select,
  onClose,
  state,
}: {
  select: (walletName: WalletName | null) => void;
  onClose: () => void;
  state: Wallet;
}) {
  return (
    <button
      className="p-4 border-1 border-color-[#E4E7EC] rounded-[12px]"
      key={state.adapter.name}
      onClick={async () => {
        try {
          select(state.adapter.name);
        } catch (e) {
          console.error(e);
        } finally {
          onClose();
        }
      }}
    >
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="min-w-[32px]">
            <Image
              src={state.adapter.icon}
              alt={state.adapter.name}
              height={32}
              width={32}
              as={NextImage}
              radius="sm"
              className={cn(
                state.adapter.name !== 'Phantom' && 'border-1 p-1',
                state.adapter.name === 'Solflare' && 'bg-[#30344f]',
              )}
            />
          </div>
          <div className="flex flex-col justify-start items-start">
            {state.adapter.name}
            {state.adapter.name === 'Phantom' && (
              <Chip
                classNames={{
                  base: 'bg-[#00DEF21A]',
                  content: 'font-light text-[12px] px-[6px]',
                }}
              >
                Recommended
              </Chip>
            )}
          </div>
        </div>

        <div className="flex gap-1 items-center justify-center">
          <div className="hidden sm:flex items-center">
            {state.readyState === WalletReadyState.Installed ? (
              state.adapter.connected ? (
                <Chip
                  color="success"
                  classNames={{
                    base: 'rounded-[4px] h-[22px]',
                    content: 'text-[12px] p-[6px] text-white leading-none',
                  }}
                >
                  Connected
                </Chip>
              ) : (
                <Chip
                  color="warning"
                  classNames={{
                    base: 'rounded-[4px] h-[22px]',
                    content: 'text-[12px] p-[6px] text-white leading-none',
                  }}
                >
                  Detected
                </Chip>
              )
            ) : (
              <Chip
                color="danger"
                classNames={{
                  base: 'rounded-[4px] h-[22px]',
                  content: 'text-[12px] p-[6px] text-white leading-none',
                }}
              >
                Not Installed
              </Chip>
            )}
          </div>
          <div className="flex items-center">
            <Image
              src={arrowRightWalletButton.src}
              alt="arrow right"
              as={NextImage}
              draggable={false}
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function NotConnectButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { wallets, select, connecting } = useWallet();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalidEmail = React.useMemo(() => {
    if (email === '') return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  if (connecting) {
    return (
      <DCarbonButton
        color="primary"
        variant="flat"
        isLoading={true}
        className="px-4 py-2 sm:py-[16px] sm:px-[32px]"
      >
        Connecting
      </DCarbonButton>
    );
  }

  return (
    <>
      <DCarbonButton
        color="primary"
        variant="flat"
        onClick={onOpen}
        className="px-4 py-2 sm:py-[16px] sm:px-[32px]"
      >
        Sign In
      </DCarbonButton>
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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4">
                <Image
                  as={NextImage}
                  alt="wallets"
                  src={walletsImage.src}
                  width={66}
                  height={66}
                  draggable={false}
                  className="-translate-y-[5px]"
                />
                Connect Wallet
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5">
                  {wallets
                    .filter((wl) =>
                      ['Phantom', 'Bitget'].includes(wl.adapter.name),
                    )
                    .map((wl) => {
                      return (
                        <WalletButton
                          state={wl}
                          key={wl.adapter.name}
                          select={select}
                          onClose={onClose}
                        />
                      );
                    })}
                </div>

                <Accordion className="px-0">
                  <AccordionItem
                    key="1"
                    aria-label="More options"
                    title="More options"
                    indicator={({ isOpen }) =>
                      isOpen ? (
                        <Image
                          src={arrowRightWalletButton.src}
                          alt="arrow right"
                          as={NextImage}
                          draggable={false}
                          width={14}
                          height={14}
                          className="rotate-270"
                        />
                      ) : (
                        <Image
                          src={arrowRightWalletButton.src}
                          alt="arrow right"
                          as={NextImage}
                          draggable={false}
                          width={14}
                          height={14}
                          className="rotate-90"
                        />
                      )
                    }
                    classNames={{
                      title: 'text-right text-sm',
                      base: 'flex flex-col',
                      heading: 'order-2',
                      trigger: 'py-0',
                    }}
                  >
                    <div className="flex flex-col gap-5">
                      {wallets
                        .filter((wl) =>
                          ['Backpack', 'Solflare'].includes(wl.adapter.name),
                        )
                        .map((wl) => {
                          return (
                            <WalletButton
                              state={wl}
                              key={wl.adapter.name}
                              select={select}
                              onClose={onClose}
                            />
                          );
                        })}
                    </div>
                  </AccordionItem>
                </Accordion>

                <div className="pt-8">
                  <div className="h-[1px] w-full bg-[#D1D1D1] relative mb-8">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm bg-white px-2 text-[#4F4F4F] text-center">
                      Or, Login to PO page
                    </span>
                  </div>

                  <span className="font-light text-[#4F4F4F] block pb-4">
                    Enter your email and password to sign in
                  </span>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (!email) {
                        ShowAlert.error({
                          message: 'Please enter your email!',
                        });

                        return;
                      }

                      if (!password) {
                        ShowAlert.error({
                          message: 'Please enter your password!',
                        });

                        return;
                      }

                      setLoading(true);

                      try {
                        const result = (await doSignIn(email, password)) as any;

                        if (result?.statusCode === 401) {
                          ShowAlert.error({
                            message: result?.message || THROW_EXCEPTION.UNKNOWN,
                          });

                          return;
                        }

                        if (result?.statusCode === 400) {
                          ShowAlert.error({
                            message:
                              (Array.isArray(result?.message)
                                ? result?.message?.join('<br />')
                                : result?.message) || THROW_EXCEPTION.UNKNOWN,
                          });

                          return;
                        }

                        if (result?.data?.redirect_url) {
                          ShowAlert.success({
                            message:
                              'Logged in successfully! Please wait redirecting...',
                          });
                          window.location.replace(result.data.redirect_url);
                        }
                      } catch (e) {
                        const error = e as Error;
                        console.error(error.message || '');
                        ShowAlert.error({
                          message: THROW_EXCEPTION.UNKNOWN,
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <Input
                      key="email"
                      type="email"
                      labelPlacement="outside"
                      label="Email"
                      placeholder="Your email address"
                      radius="none"
                      classNames={{
                        inputWrapper: cn(
                          'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color max-w-[408px]',
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
                      isDisabled={loading}
                    />

                    <div className="mt-12">
                      <Input
                        key="password"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label="toggle password visibility"
                          >
                            {isVisible ? (
                              <Image
                                src={eyeClose.src}
                                alt="hide password"
                                className="text-2xl text-default-400 pointer-events-none"
                                width={20}
                                height={20}
                                as={NextImage}
                              />
                            ) : (
                              <Image
                                src={eyeOpen.src}
                                alt="show password"
                                className="text-2xl text-default-400 pointer-events-none"
                                as={NextImage}
                                width={20}
                                height={20}
                              />
                            )}
                          </button>
                        }
                        type={isVisible ? 'text' : 'password'}
                        labelPlacement="outside"
                        label="Password"
                        placeholder="Your password"
                        radius="none"
                        classNames={{
                          inputWrapper:
                            'rounded-[4px] bg-[#F6F6F6] group-data-[focus=true]:ring-1 group-data-[focus=true]:bg-white group-data-[focus=true]:ring-primary-color max-w-[408px]',
                          label: '!text-[#21272A]',
                        }}
                        autoComplete="off"
                        value={password}
                        onValueChange={setPassword}
                        isDisabled={loading}
                        isInvalid={!!email && !password}
                        errorMessage="Please enter your password!"
                        variant={!!email && !password ? 'bordered' : 'flat'}
                      />
                    </div>

                    <div className="flex justify-end mt-2">
                      <Link
                        href={env.NEXT_PUBLIC_PO_RESET_PASSWORD}
                        className="text-sm text-[#5DAF01]"
                        isExternal
                      >
                        Reset password
                      </Link>
                    </div>

                    <DCarbonButton
                      color="primary"
                      fullWidth
                      className="mt-6"
                      type="submit"
                      isLoading={loading}
                    >
                      Sign In
                    </DCarbonButton>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default NotConnectButton;
