'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { IGetListCarbonResponse } from '@/adapters/user';
import { CARBON_IDL } from '@/contracts/carbon/carbon.idl';
import { ICarbonContract } from '@/contracts/carbon/carbon.interface';
import { THROW_EXCEPTION } from '@/utils/constants';
import { logger, splitArrayIntoChunks } from '@/utils/helpers/common';
import { createTransactionV0, sendTx } from '@/utils/helpers/solana';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { associatedAddress } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { MPL_TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { cn, Image } from '@nextui-org/react';
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
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';
import Big from 'big.js';
import { env } from 'env.mjs';
import swapIcon from 'public/images/projects/swap-icon.png';
import transferIcon from 'public/images/projects/transfer-icon.svg';
import { NumericFormat } from 'react-number-format';
import { KeyedMutator } from 'swr';
import DCarbonButton from '@components/common/button';
import DCarbonModal from '@components/common/modal';
import { ShowAlert } from '@components/common/toast';

function SwapModal({
  isOpen,
  onClose,
  allMints,
  amount,
  maxAmount,
  mints,
  manualAmount,
  setManualAmount,
  mutate,
  reset,
}: {
  isOpen: boolean;
  onClose: () => void;
  allMints: any[];
  amount?: number;
  mints?: { mint: string; amount: number }[];
  setManualAmount: (value: string) => void;
  manualAmount?: string;
  maxAmount: number;
  mutate: KeyedMutator<IGetListCarbonResponse | null>;
  reset: () => void;
}) {
  const { publicKey, wallet } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  return (
    <DCarbonModal
      onClose={onClose}
      isOpen={isOpen}
      title="Swap Token"
      icon={swapIcon.src}
      cancelBtn={
        <DCarbonButton
          fullWidth
          className="bg-[#F6F6F6]"
          onClick={onClose}
          isDisabled={loading}
        >
          Cancel
        </DCarbonButton>
      }
      isDismissable={!loading}
      okBtn={
        <DCarbonButton
          isLoading={loading}
          color="primary"
          fullWidth
          onClick={async () => {
            if (!amount) {
              if (manualAmount && Big(manualAmount).gt(Big(maxAmount))) {
                setAmountError('Max amount to swap is ' + maxAmount);
                return;
              }

              if (Big(manualAmount || 0).lte(0)) {
                setAmountError('Amount must be greater than 0');
                return;
              }
            }

            if (!publicKey || !wallet || !anchorWallet || !connection) {
              ShowAlert.error({ message: 'Please connect to wallet first!' });
              return;
            }

            if (!(wallet?.adapter as any)?.signAllTransactions) {
              ShowAlert.error({
                message: 'Your wallet not support signAllTransactions!',
              });
              return;
            }

            if (!mints || mints.length === 0) {
              ShowAlert.error({ message: 'Please select a Carbon to swap!' });
              return;
            }

            if (!allMints || allMints.length === 0) {
              ShowAlert.error({ message: 'Not found mint list!' });
              return;
            }

            setLoading(true);
            ShowAlert.loading({
              message: 'Generating transaction to swap Carbon...',
            });
            try {
              const provider = new AnchorProvider(connection, anchorWallet);
              const program = new Program<ICarbonContract>(
                CARBON_IDL as ICarbonContract,
                provider,
              );

              const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
                MPL_TOKEN_METADATA_PROGRAM_ID.toString(),
              );

              const [configContract] = PublicKey.findProgramAddressSync(
                [Buffer.from('contract_config')],
                program.programId,
              );
              const configData =
                await program.account.contractConfig.fetch(configContract);

              const mintFt = configData.mint;

              const toAta = getAssociatedTokenAddressSync(mintFt, publicKey);
              const [metadataFt] = PublicKey.findProgramAddressSync(
                [
                  Buffer.from('metadata'),
                  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                  mintFt.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID,
              );

              const checkToAta = await connection.getAccountInfo(toAta);

              const swapInstructions: TransactionInstruction[] = [];
              let index = 0;
              for await (const mint of mints) {
                const ownerAta = associatedAddress({
                  mint: new PublicKey(mint.mint),
                  owner: publicKey,
                });

                const [metadata] = PublicKey.findProgramAddressSync(
                  [
                    Buffer.from('metadata'),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    new PublicKey(mint.mint).toBuffer(),
                  ],
                  TOKEN_METADATA_PROGRAM_ID,
                );

                const txSwapIns = await program.methods
                  .swapSft(mint?.amount || 0)
                  .accounts({
                    signer: publicKey,
                    burnAta: ownerAta,
                    toAta,
                    mintSft: new PublicKey(mint.mint),
                    mintFt: mintFt,
                    metadataSft: metadata,
                    metadataFt: metadataFt,
                    sysvarProgram: SYSVAR_INSTRUCTIONS_PUBKEY,
                  })
                  .instruction();

                if (!checkToAta && index === 0) {
                  const createToAtaIns =
                    createAssociatedTokenAccountInstruction(
                      publicKey,
                      toAta,
                      publicKey,
                      mintFt,
                    );
                  if (createToAtaIns) swapInstructions.push(createToAtaIns);
                }

                if (txSwapIns) {
                  swapInstructions.push(txSwapIns);
                }

                index++;
              }

              const newSwapInstructions = splitArrayIntoChunks(
                swapInstructions,
                2,
              );

              const swapTransactions: {
                tx: VersionedTransaction;
                blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
              }[] = [];

              for await (const instruction of newSwapInstructions) {
                const swapTxV0 = await createTransactionV0(
                  connection,
                  publicKey,
                  instruction,
                );

                if (swapTxV0) {
                  swapTransactions.push(swapTxV0);
                }
              }

              ShowAlert.loading({ message: 'Swapping Carbon...' });
              const resultSwapTx = (await sendTx({
                connection,
                wallet,
                transactions:
                  swapTransactions?.length > 1
                    ? checkToAta
                      ? swapTransactions
                      : swapTransactions.slice(0, 1)
                    : swapTransactions[0],
                ...(!checkToAta && swapTransactions?.length > 1
                  ? { transactions2: swapTransactions.slice(1) }
                  : {}),
              })) as
                | {
                    value?: {
                      tx: string;
                    };
                    status: 'rejected' | 'fulfilled';
                  }[]
                | {
                    tx: string;
                    error?: string;
                  };

              const swapResult = resultSwapTx;

              let index2 = 0;
              const success = [];
              const fails = [];

              if (Array.isArray(swapResult)) {
                for await (const res of swapResult) {
                  if (res.status === 'rejected') {
                    fails.push(
                      `<div>Swap failed ${Number(
                        Big(mints?.[index2]?.amount || 0).toFixed(1),
                      ).toLocaleString(
                        'en-US',
                      )} Carbon: <span class="text-danger">Error</span>.</div>`,
                    );
                  }
                  if (res.status === 'fulfilled') {
                    success.push(
                      `<div>Swap successfully ${Number(
                        Big(mints?.[index2]?.amount || 0).toFixed(1),
                      ).toLocaleString(
                        'en-US',
                      )} Carbon: <a class="underline" href="https://explorer.solana.com/tx/${res?.value?.tx || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a></div>`,
                    );
                  }
                  index2++;
                }
              }

              if (!Array.isArray(swapResult)) {
                if (
                  swapResult?.error === THROW_EXCEPTION.USER_REJECTED_REQUEST
                ) {
                  return;
                }

                if (swapResult?.tx) {
                  success.push(
                    `<div>Swap successfully ${Number(
                      Big(mints?.[index2]?.amount || 0).toFixed(1),
                    ).toLocaleString(
                      'en-US',
                    )} Carbon: <a class="underline" href="https://explorer.solana.com/tx/${swapResult?.tx || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a></div>`,
                  );
                } else {
                  fails.push(
                    `<div>Swap failed ${Number(
                      Big(mints?.[index2]?.amount || 0).toFixed(1),
                    ).toLocaleString(
                      'en-US',
                    )} Carbon: <span class="text-danger">Error</span>.</div>`,
                  );
                }
              }

              const merged = `<div class="flex flex-col gap-2">${[...success, ...fails].join('')}</div>`;

              if (success.length > 0) {
                ShowAlert.success({
                  message: merged,
                });

                return;
              }
              if (fails.length > 0) {
                ShowAlert.error({
                  message: merged,
                });
                return;
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
              setManualAmount('');
              reset();
              onClose();
              setLoading(false);
              onClose();
              ShowAlert.dismiss('loading');
              mutate();
            }
          }}
        >
          {loading ? 'Swapping' : 'Swap'}
        </DCarbonButton>
      }
      extra={
        <div className="px-[10px] bg-[#F6F6F6] rounded-lg">
          <span className="text-sm font-light text-[#4F4F4F] leading-none">
            Balance:{' '}
          </span>
          <span className="text-sm text-[#5DAF01] font-normal leading-none">
            {maxAmount || 0} DCO2 sFT
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-2 items-center mb-2">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm" htmlFor="total">
            You send
          </label>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <NumericFormat
                thousandSeparator
                allowNegative={false}
                id="you_send"
                value={amount || Big(manualAmount || '0').toNumber() || ''}
                className={cn(
                  'text-sm w-full focus:bg-white p-3 rounded h-[40px] outline-none hover:bg-default-200 transition-all placeholder:text-[#888] placeholder:text-sm placeholder:font-normal',
                  amount ? 'bg-[#e7e7e7]' : 'bg-[#F6F6F6]',
                  amountError && !amount
                    ? 'ring-1 ring-danger'
                    : 'focus:ring-1 focus:ring-primary-color',
                )}
                placeholder="0"
                disabled={!!amount || loading}
                onValueChange={(q) => {
                  if (q?.value && Big(q?.value).gt(Big(maxAmount))) {
                    setAmountError('Max amount to swap is ' + maxAmount);
                  }

                  if (q?.value && Big(q?.value).lte(Big(maxAmount))) {
                    setAmountError(null);
                  }

                  if (Big(q?.value || 0).lte(0)) {
                    setAmountError('Amount must be greater than 0');
                  }

                  setManualAmount(q?.value || '');
                }}
              />
              <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
                DCO2 sFT
              </div>
            </div>

            {amountError && !amount && (
              <div className="text-xs text-danger">{amountError}</div>
            )}
          </div>
        </div>
        <div>
          <Image
            src={transferIcon.src}
            alt="Transfer"
            as={NextImage}
            width={32}
            height={32}
            draggable={false}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm" htmlFor="total">
            You get
          </label>
          <div className="relative">
            <NumericFormat
              thousandSeparator
              allowNegative={false}
              id="you_got"
              placeholder="0"
              disabled={!!amount || loading}
              className={cn(
                'text-sm w-full focus:bg-white p-3 rounded h-[40px] focus:ring-1 focus:ring-primary-color outline-none hover:bg-default-200 transition-all placeholder:text-[#888] placeholder:text-sm placeholder:font-normal',
                amount ? 'bg-[#e7e7e7]' : 'bg-[#F6F6F6]',
              )}
              value={amount || Big(manualAmount || '0').toNumber() || ''}
              onValueChange={(q) => {
                if (q?.value && Big(q?.value).gt(Big(maxAmount))) {
                  setAmountError('Max amount to swap is ' + maxAmount);
                }

                if (q?.value && Big(q?.value).lte(Big(maxAmount))) {
                  setAmountError(null);
                }

                if (Big(q?.value || 0).lte(0)) {
                  setAmountError('Amount must be greater than 0');
                }

                setManualAmount(q?.value || '');
              }}
            />

            <div className="text-sm text-[#4F4F4F] absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
              DCO2
            </div>
          </div>
        </div>
      </div>
    </DCarbonModal>
  );
}

export default SwapModal;
