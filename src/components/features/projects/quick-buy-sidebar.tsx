import React, { useState } from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import DCarbonButton from '@/components/common/button';
import { doGetQuickBuyListingInfo, IListingInfo } from '@adapters/project';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl';
import { ICarbonContract } from '@contracts/carbon/carbon.interface';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { Image, Select, Selection, SelectItem } from '@nextui-org/react';
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
import { NumericFormat } from 'react-number-format';
import useSWR from 'swr';
import { Skeleton } from '@components/common/loading';
import { ShowAlert } from '@components/common/toast';
import { QUERY_KEYS, THROW_EXCEPTION } from '@utils/constants';
import { logger } from '@utils/helpers/common';
import { generateListingList } from '@utils/helpers/project';
import { createTransactionV0, sendTx } from '@utils/helpers/solana';

import { env } from '../../../../env.mjs';
import arrowDownIcon from '../../../../public/images/common/arrow-down-icon.svg';

function QuickBuySidebar() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model');
  const [credits, setCredits] = useState('0');
  const [asset, setAsset] = useState<Selection>(new Set(['']));
  const [listingInfo, setListingInfo] = useState<IListingInfo[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { publicKey, wallet } = useWallet();
  let iot_model;

  switch (model) {
    case 'G':
      iot_model = 'PrjT_G' as const;
      break;
    case 'E':
      iot_model = 'PrjT_E' as const;
      break;
    default:
      iot_model = undefined;
      break;
  }
  const isAsset = Object.prototype.hasOwnProperty.call(asset, 'anchorKey');
  const { data, isLoading, mutate } = useSWR(
    [QUERY_KEYS.PROJECTS.GET_QUICK_BUY_LISTING_INFO],
    () => {
      return doGetQuickBuyListingInfo(iot_model);
    },
    {
      revalidateOnMount: true,
    },
  );
  const assetSelectOptions = data?.data?.spl_tokens?.map((info) => {
    return {
      label: info?.symbol || '',
      value: info?.mint || '',
      icon: info?.icon || '',
    };
  });
  const selectAsset = (e: any) => {
    const filterData = data?.data?.listing_carbon?.filter(
      (info) => info.payment_info?.currency === e.currentKey,
    );
    setAsset(e);
    setListingInfo(filterData);
  };
  const availableCarbon = listingInfo
    ? listingInfo.reduce(
        (partialSum, info) =>
          Big(partialSum).plus(Big(info.available)).toNumber(),
        0,
      )
    : 0;
  const handleBuyCarbon = async () => {
    if (!publicKey || !wallet || !anchorWallet || !connection) {
      ShowAlert.warning({ message: 'Please connect to wallet first!' });
      return;
    }

    if (!listingInfo || listingInfo?.length === 0) {
      logger({ message: 'No listing found!', type: 'ERROR' });
      return;
    }

    if (Big(credits || 0).lte(0)) {
      ShowAlert.error({ message: 'Amount must be greater than 0.' });
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
    if (Number(credits) > availableCarbon) {
      setCredits(Big(availableCarbon).toString);
    }
    try {
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
      const listingList = generateListingList(
        listingInfo || [],
        Big(credits).toNumber(),
      );
      const transactions: {
        tx: VersionedTransaction;
        blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
      }[] = [];
      const listAta: string[] = [];
      for await (const item of listingList?.result || []) {
        const carbonMint = new PublicKey(item.mint);
        const carbonOwner = new PublicKey(item.seller);
        const tokenListingInfo = new PublicKey(item.key);

        let sourceAtaToken: PublicKey | undefined;
        let destinationAtaToken: PublicKey | undefined;
        let stableTokenMint: PublicKey | undefined;
        if (!isSol) {
          stableTokenMint = new PublicKey(item.payment_info?.currency || '');
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
              `<div>Purchase failed ${Number(Big(listingList?.result[index].available).toFixed(4)).toLocaleString('en-US')} Carbon: <span class="text-danger">Error</span>.</div>`,
            );
          }

          if (res.status === 'fulfilled') {
            success.push(
              `<div>Purchase successfully ${Number(Big(listingList?.result[index].available).toFixed(4)).toLocaleString('en-US')} Carbon: <a class="underline" href="https://explorer.solana.com/tx/${result && result.length > 0 ? result[0].tx : ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a></div>`,
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
            <div>Successfully purchased ${Number(Big(listingList?.result[0]?.available || 0).toFixed(4)).toLocaleString('en-US')} Carbon</div>
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
  const handleCredits = async (e: any) => {
    setCredits(
      String(Number(e) > availableCarbon ? availableCarbon : Number(e)),
    );
  };
  return (
    <>
      <div>
        <p className="text-sm font-light text-[#454545] mb-16">
          Purchase credits from any of our farms.
        </p>
        <label className="text-sm" htmlFor="credits">
          <div className="flex gap-1">
            Carbon Credit{' '}
            {isLoading ? (
              <Skeleton>
                <div className="h-[14px] w-6" />
              </Skeleton>
            ) : (
              <>
                {' '}
                {'('}
                {listingInfo ? availableCarbon : data?.data?.available_carbon}
                {')'}{' '}
              </>
            )}
          </div>
        </label>
        <NumericFormat
          key="credits"
          thousandSeparator
          decimalScale={1}
          allowNegative={false}
          id="credits"
          className="disabled:bg-default-200 disabled:cursor-not-allowed text-sm mt-2 mb-4 w-full bg-[#F6F6F6] p-3 rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal focus:bg-white"
          placeholder="1"
          autoComplete="off"
          value={credits}
          onValueChange={handleCredits}
          disabled={isLoading || !isAsset}
          min={0}
        />
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
                isInvalid={!isAsset}
                errorMessage="Please select asset!"
                aria-label="Asset"
                label=""
                items={assetSelectOptions}
                classNames={{
                  trigger:
                    'bg-[#F6F6F6] shadow-none rounded-[4px] data-[hover=true]:bg-default-200',
                  popoverContent: 'rounded-[4px]',
                }}
                listboxProps={{
                  itemClasses: {
                    base: 'data-[selectable=true]:focus:bg-[#EAFFC7] rounded-[4px]',
                  },
                }}
                radius="none"
                selectedKeys={asset}
                onSelectionChange={selectAsset}
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
                renderValue={(items: any[]) => {
                  return items.map((item: any) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <Image
                        src={item.data?.icon}
                        alt={item.data?.label || ''}
                        as={NextImage}
                        width={16}
                        height={16}
                        draggable={false}
                      />
                      <span>{item.data?.label}</span>
                    </div>
                  ));
                }}
              >
                {(item: any) => (
                  <SelectItem key={item.value} textValue={item.label}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.icon}
                        alt={item.label || ''}
                        as={NextImage}
                        width={16}
                        height={16}
                        draggable={false}
                      />
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

        <DCarbonButton
          isLoading={isLoading || loading}
          color="primary"
          fullWidth
          className="mt-6 disabled:bg-default-200 disabled:cursor-not-allowed"
          onClick={handleBuyCarbon}
          disabled={isLoading || loading || !isAsset}
        >
          Buy Now
        </DCarbonButton>
      </div>
    </>
  );
}

export default QuickBuySidebar;
