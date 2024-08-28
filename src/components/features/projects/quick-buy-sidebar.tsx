import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import DCarbonButton from '@/components/common/button';
import { doGetQuickBuyListingInfo, IListingInfo } from '@adapters/project';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl';
import { ICarbonContract } from '@contracts/carbon/carbon.interface';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
  cn,
  Image,
  Select,
  Selection,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
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
import { BeatLoader } from 'react-spinners';
import useSWR from 'swr';
import { Skeleton } from '@components/common/loading';
import { ShowAlert } from '@components/common/toast';
import { QUERY_KEYS, THROW_EXCEPTION } from '@utils/constants';
import { logger } from '@utils/helpers/common';
import { generateListingList } from '@utils/helpers/project';
import { createTransactionV0, sendTx } from '@utils/helpers/solana';

import QuickBuyModal from './quickbuy-modal';

function QuickBuySidebar() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model');
  const [credits, setCredits] = useState<string>('');
  const [asset, setAsset] = useState<Selection>(new Set(['']));
  const [listingInfo, setListingInfo] = useState<IListingInfo[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { publicKey, wallet } = useWallet();
  const [touched, setTouched] = useState<boolean>(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const { isOpen, onClose, onOpenChange } = useDisclosure({
    id: 'quick-buy-modal',
  });
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

  const openBuyModal = () => {
    if (!publicKey || !wallet || !anchorWallet || !connection) {
      ShowAlert.warning({ message: 'Please connect to wallet first!' });
      return;
    }
    onOpenChange();
  };

  useEffect(() => {
    if ((asset as any)?.currentKey) {
      const filterData = data?.data?.listing_carbon?.filter(
        (info) => info.payment_info?.currency === (asset as any)?.currentKey,
      );

      setListingInfo(filterData);
    }
  }, [asset, data?.data?.listing_carbon]);

  const selectAsset = (e: any) => {
    setAsset(e);
  };
  const availableCarbon = listingInfo
    ? listingInfo.reduce(
        (partialSum, info) =>
          Big(partialSum).plus(Big(info.available)).toNumber(),
        0,
      )
    : 0;

  const maxCredits = listingInfo
    ? availableCarbon
    : data?.data?.available_carbon;

  const handleBuyCarbon = async () => {
    if (credits && Big(maxCredits || 0).eq(0)) {
      setCreditsError('No credits available, please try another asset');
    }

    if (Big(credits || 0).lte(0)) {
      setCreditsError('Credits must be greater than 0');
      return;
    }

    if (credits && maxCredits && Big(credits).gt(Big(maxCredits))) {
      setCreditsError('Max credits is ' + maxCredits);
      return;
    }

    if (credits && Big(credits).lte(Big(maxCredits || 0))) {
      setCreditsError(null);
    }

    if (!isAsset) {
      setTouched(true);
      return;
    }

    if (!publicKey || !wallet || !anchorWallet || !connection) {
      ShowAlert.warning({ message: 'Please connect to wallet first!' });
      return;
    }

    if (!listingInfo || listingInfo?.length === 0) {
      logger({ message: 'No listing found!', type: 'ERROR' });
      return;
    }

    if (!(wallet?.adapter as any)?.signAllTransactions) {
      ShowAlert.error({ message: 'Not support signAllTransactions!' });
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
      onClose();
    }
  };
  const handleCredits = async (e: any) => {
    setCredits(e);
  };

  return (
    <>
      {publicKey && credits && (
        <QuickBuyModal
          isOpen={isOpen}
          onClose={onClose}
          data={
            generateListingList(listingInfo || [], Big(credits)?.toNumber())
              .result || []
          }
          handleBuy={handleBuyCarbon}
          publicKey={publicKey}
          isMinting={loading}
        />
      )}
      <div>
        <p className="text-sm font-light text-[#454545] mb-8">
          Purchase credits from any of our farms.
        </p>
        <label className="text-sm" htmlFor="credits">
          <div className="flex gap-1 items-center justify-between flex-wrap">
            Carbon Credit{' '}
            {isLoading ? (
              <BeatLoader size={10} color="#7BDA08" loading className="px-2" />
            ) : (
              <span className="flex items-center gap-1">
                {'Available: '}
                <span className="text-primary-color font-medium text-base">{` ${Number(Big(maxCredits || 0).toFixed(1)).toLocaleString('en-US')}`}</span>
              </span>
            )}
          </div>
        </label>
        <div className="mb-4 flex flex-col gap-1">
          <NumericFormat
            key="credits"
            thousandSeparator
            decimalScale={1}
            allowNegative={false}
            id="credits"
            className="disabled:bg-default-200 text-sm mt-2 w-full bg-[#F6F6F6] p-3 rounded h-[40px] outline-none hover:bg-gray-50 transition-all focus:ring-1 focus:ring-primary-color placeholder:text-[#888] placeholder:text-sm placeholder:font-normal focus:bg-white"
            placeholder="Enter credit"
            autoComplete="off"
            value={credits}
            onValueChange={(q) => {
              if (q?.value && Big(maxCredits || 0).eq(0)) {
                setCreditsError(
                  'No credits available, please try another asset',
                );
              }
              if (q?.value && maxCredits && Big(q.value).gt(Big(maxCredits))) {
                setCreditsError('Max credits is ' + maxCredits);
              }

              if (q?.value && Big(q?.value).lte(Big(maxCredits || 0))) {
                setCreditsError(null);
              }

              if (Big(q?.value || 0).lte(0)) {
                setCreditsError('Credits must be greater than 0');
              }

              handleCredits(q?.value || '');
            }}
            min={0}
          />
          {creditsError && (
            <div className="text-xs text-danger px-1">{creditsError}</div>
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
                isInvalid={isAsset || !touched ? false : true}
                errorMessage="Please select asset!"
                variant={isAsset || !touched ? undefined : 'bordered'}
                aria-label="Asset"
                label=""
                items={assetSelectOptions}
                classNames={{
                  trigger: cn(
                    'bg-[#F6F6F6] shadow-none rounded-[4px] data-[hover=true]:bg-default-200',
                    isAsset || !touched ? '' : 'border-small',
                  ),
                  popoverContent: 'rounded-[4px]',
                }}
                listboxProps={{
                  itemClasses: {
                    base: 'data-[selectable=true]:focus:bg-[#EAFFC7] rounded-[4px]',
                  },
                }}
                onClose={() => setTouched(true)}
                radius="none"
                selectedKeys={asset}
                onSelectionChange={selectAsset}
                disallowEmptySelection
                placeholder="Select asset"
                selectorIcon={
                  <div>
                    <Image
                      src={arrowDownIcon.src}
                      as={NextImage}
                      alt="arrow"
                      width={16}
                      height={16}
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
          isLoading={loading}
          color="primary"
          fullWidth
          className="mt-6"
          onClick={openBuyModal}
        >
          Buy Now
        </DCarbonButton>
      </div>
    </>
  );
}

export default QuickBuySidebar;
