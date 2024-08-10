'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import { doGetProjectListingInfo } from '@/adapters/project';
import DCarbonButton from '@/components/common/button';
import { Skeleton } from '@/components/common/loading';
import { ShowAlert } from '@/components/common/toast';
import { CARBON_IDL } from '@/contracts/carbon/carbon.idl';
import { ICarbonContract } from '@/contracts/carbon/carbon.interface';
import { QUERY_KEYS } from '@/utils/constants';
import { logger } from '@/utils/helpers/common';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { Image, Select, Selection, SelectItem } from '@nextui-org/react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import Big from 'big.js';
import arrowDownIcon from 'public/images/common/arrow-down-icon.svg';
import { NumericFormat } from 'react-number-format';
import useSWR from 'swr';

const assetSelectOptions = [
  {
    label: 'USDC',
    value: 'usdc',
  },
];

function InformationDetailSidebar(props: { data: any }) {
  const [quantity, setQuantity] = useState<string>('');
  const [asset, setAsset] = useState<Selection>(new Set(['usdc']));
  const { slug } = useParams();
  const [total, setTotal] = useState<number>(0);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { publicKey, wallet } = useWallet();

  const { data, isLoading } = useSWR(
    [QUERY_KEYS.PROJECTS.GET_PROJECT_LISTING_INFO],
    () => {
      return doGetProjectListingInfo(slug as string);
    },
    {
      revalidateOnMount: true,
    },
  );

  const handleBuyCarbon = async () => {
    if (!publicKey || !wallet || !anchorWallet || !connection) {
      ShowAlert.warning({ message: 'Please connect to wallet first!' });
      return;
    }

    if (!data?.data?.payment_info?.currency?.mint) {
      logger({ message: 'No payment information found!', type: 'ERROR' });
      return;
    }

    const mint = new PublicKey(data.data.payment_info.currency.mint);

    const provider = new AnchorProvider(connection, anchorWallet);
    const program = new Program<ICarbonContract>(
      CARBON_IDL as ICarbonContract,
      provider,
    );
    const anchorProvider = program.provider as AnchorProvider;
    const upgradableAuthority = anchorProvider.wallet;
    const token_owner = upgradableAuthority.publicKey;

    const tokenListingInfo = new PublicKey(
      'BRZF19M2JPy8CPrcP9zEbXkqD5jq32ymHFeJQeJuxXrZ',
    );

    const sourceAta = getAssociatedTokenAddressSync(mint, token_owner);
    const toAta = getAssociatedTokenAddressSync(mint, publicKey);

    const sourceAtaToken = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        publicKey,
      )
    ).address;

    const buyIns = await program.methods
      .buy(3)
      .accounts({
        signer: publicKey,
        mint: mint,
        sourceAta: sourceAta,
        toAta: toAta,
        tokenListingInfo: tokenListingInfo,
        tokenOwner: token_owner,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts([
        {
          pubkey: TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: mint,
          isWritable: false,
          isSigner: false,
        },
        {
          pubkey: sourceAtaToken,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: destinationAtaToken,
          isSigner: false,
          isWritable: true,
        },
      ])
      .instruction();

    const tx = new Transaction().add(buyIns);
    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // tx.partialSign(buyer);
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
                thousandSeparator
                allowNegative={false}
                onValueChange={(q) => {
                  setQuantity(q?.value);
                  if (
                    data?.data?.available_carbon &&
                    Big(q?.value || 0).gt(data.data.available_carbon)
                  ) {
                    setQuantityError('Quantity exceeds available Carbon.');
                  }

                  if (
                    data?.data?.available_carbon &&
                    Big(q?.value || 0).lte(data.data.available_carbon) &&
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
              >
                {(item) => (
                  <SelectItem key={item.value} textValue={item.label}>
                    <div className="flex gap-2 items-center">{item.label}</div>
                  </SelectItem>
                )}
              </Select>
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
                {(
                  Array.from((asset as any)?.values())?.[0] as string
                )?.toUpperCase() || ''}
              </div>
            </div>
          </div>

          <DCarbonButton color="primary" onClick={handleBuyCarbon}>
            Buy
          </DCarbonButton>
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
