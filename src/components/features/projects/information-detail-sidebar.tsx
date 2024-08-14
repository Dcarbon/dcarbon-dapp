'use client';

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import { doGetProjectListingInfo } from '@/adapters/project';
import DCarbonButton from '@/components/common/button';
import { Skeleton } from '@/components/common/loading';
import { ShowAlert } from '@/components/common/toast';
import { CARBON_IDL } from '@/contracts/carbon/carbon.idl';
import { ICarbonContract } from '@/contracts/carbon/carbon.interface';
import { QUERY_KEYS, THROW_EXCEPTION } from '@/utils/constants';
import { logger } from '@/utils/helpers/common';
import { generateListingList } from '@/utils/helpers/project';
import { createTransactionV0, sendTx } from '@/utils/helpers/solana';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { Image, Link, Select, Selection, SelectItem } from '@nextui-org/react';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  BlockhashWithExpiryBlockHeight,
  PublicKey,
  RpcResponseAndContext,
  VersionedTransaction,
} from '@solana/web3.js';
import Big from 'big.js';
import { env } from 'env.mjs';
import arrowDownIcon from 'public/images/common/arrow-down-icon.svg';
import { NumericFormat } from 'react-number-format';
import useSWR from 'swr';

function InformationDetailSidebar(props: { data: any }) {
  const [quantity, setQuantity] = useState<string>('');
  const [asset, setAsset] = useState<Selection>(new Set(['']));
  const { slug } = useParams();
  const [total, setTotal] = useState<number>(0);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { publicKey, wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { data, isLoading, mutate } = useSWR(
    [QUERY_KEYS.PROJECTS.GET_PROJECT_LISTING_INFO],
    () => {
      return doGetProjectListingInfo(slug as string);
    },
    {
      revalidateOnMount: true,
    },
  );

  useEffect(() => {
    if (data?.data?.payment_info?.currency?.symbol) {
      setAsset((state) =>
        state !== data?.data?.payment_info?.currency?.symbol
          ? new Set([
              data?.data?.payment_info?.currency?.symbol?.toLowerCase() || '',
            ])
          : new Set(['']),
      );
    }
  }, [data?.data?.payment_info?.currency?.symbol]);

  const assetSelectOptions = [
    {
      label: data?.data?.payment_info?.currency?.symbol || '',
      value: data?.data?.payment_info?.currency?.symbol?.toLowerCase() || '',
    },
  ];

  const handleBuyCarbon = async () => {
    if (!publicKey || !wallet || !anchorWallet || !connection) {
      ShowAlert.warning({ message: 'Please connect to wallet first!' });
      return;
    }

    if (!data?.data?.payment_info?.currency?.mint) {
      logger({ message: 'No payment information found!', type: 'ERROR' });
      return;
    }

    if (
      !data?.data?.listing_carbon ||
      data?.data?.listing_carbon?.length === 0
    ) {
      logger({ message: 'No listing found!', type: 'ERROR' });
      return;
    }

    if (Big(quantity || 0).lte(0)) {
      ShowAlert.error({ message: 'Quantity must be greater than 0.' });
      return;
    }

    if (!(wallet?.adapter as any)?.signAllTransactions) {
      ShowAlert.error({ message: 'Not support signAllTransactions!' });
      return;
    }

    if (!Array.from(asset) || Array.from(asset).length === 0) {
      ShowAlert.error({ message: 'Please select asset!' });
      return;
    }

    setLoading(true);
    const isSol = Array.from(asset)?.[0]?.toString().toLowerCase() === 'sol';

    try {
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );

      const getlistingList = generateListingList(
        data.data.listing_carbon,
        Big(quantity).toNumber(),
      );

      const transactions: {
        tx: VersionedTransaction;
        blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
      }[] = [];

      const listAta: string[] = [];
      for await (const item of getlistingList?.result || []) {
        const carbonMint = new PublicKey(item.mint);
        const carbonOwner = new PublicKey(item.seller);
        const tokenListingInfo = new PublicKey(item.key);

        let sourceAtaToken: PublicKey | undefined;
        let destinationAtaToken: PublicKey | undefined;
        let stableTokenMint: PublicKey | undefined;
        if (!isSol) {
          stableTokenMint = new PublicKey(
            (data as any).data.payment_info.currency.mint,
          );
          destinationAtaToken = getAssociatedTokenAddressSync(
            stableTokenMint,
            carbonOwner,
          );
          sourceAtaToken = getAssociatedTokenAddressSync(
            stableTokenMint,
            publicKey,
          );
        }

        const sourceAta = getAssociatedTokenAddressSync(
          carbonMint,
          carbonOwner,
        );
        const toAta = getAssociatedTokenAddressSync(carbonMint, publicKey);

        const buyIns = await program.methods
          .buy(Big(item.available).toNumber())
          .accounts({
            signer: publicKey,
            mint: carbonMint,
            sourceAta: sourceAta,
            toAta: toAta,
            tokenListingInfo: tokenListingInfo,
            tokenOwner: carbonOwner,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .remainingAccounts([
            {
              pubkey: TOKEN_PROGRAM_ID,
              isSigner: false,
              isWritable: false,
            },
            ...(isSol
              ? ([] as any)
              : [
                  {
                    pubkey: stableTokenMint,
                    isWritable: false,
                    isSigner: false,
                  },
                ]),
            ...(isSol
              ? ([] as any)
              : [
                  {
                    pubkey: sourceAtaToken,
                    isSigner: false,
                    isWritable: true,
                  },
                ]),
            ...(isSol
              ? ([] as any)
              : [
                  {
                    pubkey: destinationAtaToken,
                    isSigner: false,
                    isWritable: true,
                  },
                ]),
          ])
          .instruction();
        const toAtaAccount = await connection.getAccountInfo(toAta);
        const listIns = [buyIns];
        if (!toAtaAccount) {
          if (!listAta.includes(carbonMint.toString())) {
            const createAtaIns = createAssociatedTokenAccountInstruction(
              publicKey,
              toAta,
              publicKey,
              carbonMint,
            );
            listIns.unshift(createAtaIns);
            listAta.push(carbonMint.toString());
          }
        }
        const txVer0 = await createTransactionV0(
          connection,
          publicKey,
          listIns,
        );

        if (txVer0) {
          transactions.push(txVer0);
        }
      }

      const result = await sendTx({
        connection,
        wallet,
        transactions: transactions?.length > 1 ? transactions : transactions[0],
      });

      const isMultiTx = Array.isArray(result);

      if (isMultiTx) {
        let index = 0;
        const success = [];
        const fails = [];
        for await (const res of result) {
          if (res.status === 'rejected') {
            fails.push(
              `<div>Purchase failed ${Number(Big(getlistingList?.result[index].available).toFixed(1)).toLocaleString('en-US')} Carbon: <span class="text-danger">Error</span>.</div>`,
            );
          }

          if (res.status === 'fulfilled') {
            success.push(
              `<div>Purchase successfully ${Number(Big(getlistingList?.result[index].available).toFixed(1)).toLocaleString('en-US')} Carbon: <a class="underline" href="https://explorer.solana.com/tx/${res?.value?.tx || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a></div>`,
            );
          }
          index++;
        }

        const merged = `<div class="flex flex-col gap-2">${[...success, ...fails].join('')}</div>`;

        if (success.length > 0) {
          mutate();
          ShowAlert.success({
            message: merged,
          });
          return;
        }

        if (fails.length > 0) {
          if (success.length > 0) {
            mutate();
          }
          ShowAlert.error({
            message: merged,
          });
          return;
        }
      } else {
        if (result?.tx) {
          mutate();
          ShowAlert.success({
            message: `<div>
            <div>Successfully purchased ${Number(Big(getlistingList?.result[0]?.available || 0).toFixed(4)).toLocaleString('en-US')} Carbon</div>
            <a class="underline" href="https://explorer.solana.com/tx/${result?.tx}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a>
            </div>`,
          });
          return;
        }
      }
    } catch (e) {
      const error = e as Error;
      logger({ message: error?.toString(), type: 'ERROR' });
      if (error?.message === 'ONCHAIN_TIMEOUT') {
        ShowAlert.error({ message: THROW_EXCEPTION.ONCHAIN_TIMEOUT });
        return;
      }
      ShowAlert.error({ message: THROW_EXCEPTION.NETWORK_CONGESTED });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#F6F6F6] p-4 rounded-lg text-[#21272A]">
        <h3 className="text-[23px] font-medium mb-6">Information</h3>

        {isLoading ? (
          <div className="bg-[#FFFFFF] p-4 rounded flex flex-col gap-2">
            <Skeleton className="rounded">
              <div className="h-[20px]" />
            </Skeleton>
            <Skeleton className="rounded">
              <div className="h-[28px]" />
            </Skeleton>
          </div>
        ) : (
          <>
            {data?.data?.available_carbon ||
            data?.data?.available_carbon === 0 ||
            (data?.data?.payment_info?.exchange_rate &&
              data?.data?.payment_info?.currency?.symbol) ? (
              <div className="bg-[#FFFFFF] p-4 rounded">
                {data?.data?.payment_info?.exchange_rate &&
                data?.data?.payment_info?.currency?.symbol ? (
                  <div className="text-sm font-light mb-2 flex flex-wrap gap-2 items-center">
                    <span>1 carbon credit = </span>
                    <span className="flex items-center gap-2">
                      {Number(
                        Big(data.data.payment_info.exchange_rate).toFixed(4),
                      ).toLocaleString('en-US')}{' '}
                      <span className="flex items-center gap-1">
                        {data.data.payment_info.currency.icon && (
                          <Image
                            src={data.data.payment_info.currency.icon}
                            alt={data.data.payment_info.currency.name}
                            as={NextImage}
                            width={16}
                            height={16}
                            draggable={false}
                          />
                        )}
                        <span>{data.data.payment_info.currency.symbol}</span>
                      </span>
                    </span>
                  </div>
                ) : null}
                {data?.data?.available_carbon ||
                data?.data?.available_carbon === 0 ? (
                  <div className="text-sm font-light flex flex-wrap gap-3 items-baseline">
                    <span>Available Carbon:</span>
                    <span className="font-medium text-lg text-primary-color">
                      {Number(
                        Big(data.data.available_carbon).toFixed(4),
                      ).toLocaleString('en-US')}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        )}

        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="quantity">
              Quantity
            </label>
            <div className="relative">
              <NumericFormat
                value={quantity}
                decimalScale={1}
                thousandSeparator
                allowNegative={false}
                onValueChange={(q) => {
                  setQuantity(q?.value);

                  if (
                    Big(q?.value || 0).gt(data?.data?.available_carbon || 0)
                  ) {
                    setQuantityError('Quantity exceeds available Carbon.');
                  }

                  if (
                    Big(q?.value || 0).lte(data?.data?.available_carbon || 0) &&
                    quantityError
                  ) {
                    setQuantityError(null);
                  }

                  if (data?.data?.payment_info?.exchange_rate) {
                    setTotal(
                      Number(
                        Big(q?.value || 0)
                          .mul(Big(data.data.payment_info.exchange_rate))
                          .toFixed(4),
                      ),
                    );
                  }
                }}
                id="quantity"
                className="text-sm w-full bg-white p-3 pr-[82.63px] rounded h-[40px] outline-none hover:bg-default-200 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal focus:bg-white"
                placeholder="0.1"
              />

              <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                CARBON
              </div>
            </div>
            {quantityError && (
              <div className="text-xs text-danger">{quantityError}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="asset">
              Asset
            </label>
            <div className="relative">
              {isLoading ? (
                <Skeleton className="rounded">
                  <div className="h-[40px]" />
                </Skeleton>
              ) : (
                <Select
                  aria-label="Asset"
                  label=""
                  items={assetSelectOptions}
                  classNames={{
                    trigger: 'bg-white shadow-none rounded-[4px]',
                    popoverContent: 'rounded-[4px]',
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: 'data-[selectable=true]:focus:bg-[#EAFFC7] rounded-[4px]',
                    },
                  }}
                  radius="none"
                  selectedKeys={asset}
                  onSelectionChange={setAsset}
                  disallowEmptySelection
                  selectorIcon={
                    <div>
                      <Image
                        src={arrowDownIcon.src}
                        as={NextImage}
                        alt="arrow"
                        width={20}
                        height={20}
                        draggable={false}
                        radius="none"
                      />
                    </div>
                  }
                  renderValue={(items) => {
                    return items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        {data?.data?.payment_info?.currency?.icon && (
                          <Image
                            src={data.data.payment_info.currency.icon}
                            alt={data.data.payment_info.currency.name || ''}
                            as={NextImage}
                            width={16}
                            height={16}
                            draggable={false}
                          />
                        )}
                        <span>{item.data?.label}</span>
                      </div>
                    ));
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value} textValue={item.label}>
                      <div className="flex items-center gap-2">
                        {data?.data?.payment_info?.currency?.icon && (
                          <Image
                            src={data.data.payment_info.currency.icon}
                            alt={data.data.payment_info.currency.name || ''}
                            as={NextImage}
                            width={16}
                            height={16}
                            draggable={false}
                          />
                        )}
                        <div className="flex gap-2 items-center">
                          {item.label}
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="total">
              Total
            </label>
            <div className="relative">
              <NumericFormat
                disabled
                thousandSeparator
                allowNegative={false}
                id="total"
                className="text-sm w-full bg-[#E7E7E7] p-3 pr-[52.63px] rounded h-[40px] outline-none hover:bg-default-200 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal focus:bg-white"
                placeholder="0"
                value={total}
              />

              <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                {isLoading ? (
                  <Skeleton className="rounded">
                    <div className="h-[20px] w-[39px]" />
                  </Skeleton>
                ) : (
                  <>
                    {(
                      Array.from((asset as any)?.values())?.[0] as string
                    )?.toUpperCase() || ''}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 lg:gap-6">
            <Link
              href="https://calendly.com/tunguyen-m1db/30min"
              isExternal
              className="flex-auto w-2/4"
            >
              <DCarbonButton
                variant="bordered"
                color="primary"
                className="w-full"
              >
                Book A Call
              </DCarbonButton>
            </Link>
            <DCarbonButton
              color="primary"
              className="flex-auto w-2/4"
              onPress={handleBuyCarbon}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Buy Carbon'}
            </DCarbonButton>
          </div>
        </div>
      </div>

      {props?.data?.data?.location?.iframe && (
        <div className="bg-[#F6F6F6] p-4 rounded-lg text-[#21272A] mt-6">
          <h3 className="text-[23px] font-medium mb-6">Address</h3>
          <div className="text-sm mb-2">Location</div>
          <div
            id="project-detail"
            dangerouslySetInnerHTML={{
              __html: props?.data.data.location.iframe,
            }}
          />
        </div>
      )}
    </>
  );
}

export default InformationDetailSidebar;
