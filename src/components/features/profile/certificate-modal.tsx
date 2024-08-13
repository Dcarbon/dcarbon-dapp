'use client';

import React, { useState } from 'react';
import {
  doGenerateBurnMetadata,
  doGenerateNftMetadata,
  IGetListCarbonResponse,
} from '@/adapters/user';
import { ShowAlert } from '@/components/common/toast';
import { CARBON_IDL } from '@/contracts/carbon/carbon.idl';
import { ICarbonContract } from '@/contracts/carbon/carbon.interface';
import { THROW_EXCEPTION } from '@/utils/constants';
import { logger } from '@/utils/helpers/common';
import { IBurningCarbon } from '@/utils/helpers/profile';
import { createTransactionV0, sendTx } from '@/utils/helpers/solana';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { MPL_TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { Tab, Tabs } from '@nextui-org/react';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  BlockhashWithExpiryBlockHeight,
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  VersionedTransaction,
} from '@solana/web3.js';
import Big from 'big.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { env } from 'env.mjs';
import cerfiticateIcon from 'public/images/projects/cerfiticate-icon.png';
import { toast } from 'sonner';
import { KeyedMutator } from 'swr';

import DCarbonButton from '../../common/button';
import DCarbonModal from '../../common/modal';
import CertificateCorporate from './certificate-corporate';
import CertificateIndividual from './certificate-individual';

dayjs.extend(utc);

type TTab = 'individual' | 'corporate';

function CertificateModal({
  isOpen,
  onClose,
  onBack,
  amount,
  mints,
  allMints = [],
  mutate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  amount: number;
  mints?: string[];
  allMints: IBurningCarbon[];
  mutate: KeyedMutator<IGetListCarbonResponse | null>;
}) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [isNameInvalid, setIsNameInvalid] = useState<boolean>(false);

  const [projectType, setProjectType] = useState<string>('');
  const [isProjectTypeInvalid, setIsProjectTypeInvalid] =
    useState<boolean>(false);

  const [projectLocation, setProjectLocation] = useState<string>('');
  const [isProjectLocationInvalid, setIsProjectLocationInvalid] =
    useState<boolean>(false);

  const [reason, setReason] = useState<string>('');

  const [address, setAddress] = useState<string>('');
  const [isAddressInvalid, setIsAddressInvalid] = useState<boolean>(false);
  const [country, setCountry] = useState<string>('');
  const [isCountryInvalid, setIsCountryInvalid] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TTab>('individual');

  return (
    <DCarbonModal
      onClose={onClose}
      isOpen={isOpen}
      title="Ceritificate Info"
      icon={cerfiticateIcon.src}
      cancelBtn={
        <DCarbonButton
          fullWidth
          className="bg-[#F6F6F6]"
          onClick={onBack}
          isDisabled={loading}
        >
          Back
        </DCarbonButton>
      }
      isDismissable={!loading}
      okBtn={
        <DCarbonButton
          isLoading={loading}
          color="primary"
          fullWidth
          onClick={async () => {
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

            if (!amount) {
              ShowAlert.error({ message: 'Please input amount of Carbon!' });
              return;
            }

            if (!mints || mints.length === 0) {
              ShowAlert.error({ message: 'Please select a Carbon to burn!' });
              return;
            }

            if (!allMints || allMints.length === 0) {
              ShowAlert.error({ message: 'Not found mint list!' });
              return;
            }

            if (!name) {
              setIsNameInvalid(true);
              return;
            }

            if (!projectType) {
              setIsProjectTypeInvalid(true);
              return;
            }

            if (!projectLocation) {
              setIsProjectLocationInvalid(true);
              return;
            }

            if (selectedTab === 'corporate') {
              if (!address) {
                setIsAddressInvalid(true);
                return;
              }

              if (!country) {
                setIsCountryInvalid(true);
                return;
              }
            }

            setLoading(true);
            try {
              const provider = new AnchorProvider(connection, anchorWallet);
              const program = new Program<ICarbonContract>(
                CARBON_IDL as ICarbonContract,
                provider,
              );
              const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
                MPL_TOKEN_METADATA_PROGRAM_ID.toString(),
              );

              const burnTransactions: {
                tx: VersionedTransaction;
                blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
              }[] = [];
              for await (const mint of mints) {
                const carbonMint = new PublicKey(mint);

                const burnAta = getAssociatedTokenAddressSync(
                  carbonMint,
                  publicKey,
                );
                const [metadata] = PublicKey.findProgramAddressSync(
                  [
                    Buffer.from('metadata'),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    carbonMint.toBuffer(),
                  ],
                  TOKEN_METADATA_PROGRAM_ID,
                );
                const tx = await program.methods
                  .burnSft(allMints.find((m) => m.mint === mint)?.amount || 0)
                  .accounts({
                    signer: publicKey,
                    mintSft: mint,
                    burnAta,
                    metadataSft: metadata,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    sysvarProgram: SYSVAR_INSTRUCTIONS_PUBKEY,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                  })
                  .instruction();

                const burnTxV0 = await createTransactionV0(
                  connection,
                  publicKey,
                  tx,
                );

                if (burnTxV0) {
                  burnTransactions.push(burnTxV0);
                }
              }

              const nftMint = Keypair.generate();
              const tokenAccount = getAssociatedTokenAddressSync(
                nftMint.publicKey,
                publicKey,
              );
              const [collectionPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from('Collection')],
                program.programId,
              );
              const [collectionMetadataPDA] = PublicKey.findProgramAddressSync(
                [
                  Buffer.from('metadata', 'utf8'),
                  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                  collectionPDA.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID,
              );
              const [metadataAccount] = PublicKey.findProgramAddressSync(
                [
                  Buffer.from('metadata', 'utf8'),
                  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                  nftMint.publicKey.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID,
              );
              const [collectionMasterEditionPDA] =
                PublicKey.findProgramAddressSync(
                  [
                    Buffer.from('metadata', 'utf8'),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    collectionPDA.toBuffer(),
                    Buffer.from('edition', 'utf8'),
                  ],
                  TOKEN_METADATA_PROGRAM_ID,
                );

              const [masterEditionPDA] = PublicKey.findProgramAddressSync(
                [
                  Buffer.from('metadata', 'utf8'),
                  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                  nftMint.publicKey.toBuffer(),
                  Buffer.from('edition', 'utf8'),
                ],
                TOKEN_METADATA_PROGRAM_ID,
              );

              ShowAlert.loading({ message: 'Generating certificate...' });
              const pdfResponse = await doGenerateBurnMetadata(
                publicKey.toBase58(),
                {
                  amount,
                  transaction_id: ' ',
                  date: dayjs().utc().unix(),
                  owner: name,
                  project_location: projectLocation,
                  project_name: 'Example',
                },
              );

              if (!pdfResponse?.data?.url) {
                toast.dismiss('loading');
                ShowAlert.error({
                  message: 'Failed to generate certificate!',
                });
                return;
              }

              ShowAlert.loading({ message: 'Sending transaction...' });
              const metadata = await doGenerateNftMetadata(
                publicKey.toBase58(),
                {
                  name: 'NFT Carbon',
                  symbol: 'NCB',
                  image: 'image',
                  attributes: [
                    {
                      trait_type: 'name',
                      value: name,
                    },
                    {
                      trait_type: 'amount',
                      value: amount.toString(),
                    },
                    {
                      trait_type: 'project_type',
                      value: projectType,
                    },
                    {
                      trait_type: 'project_location',
                      value: projectLocation,
                    },
                    { trait_type: 'file', value: pdfResponse.data.url },
                    ...(reason
                      ? [
                          {
                            trait_type: 'reason',
                            value: reason,
                          },
                        ]
                      : []),
                    ...(selectedTab === 'corporate' && address
                      ? [
                          {
                            trait_type: 'address',
                            value: address,
                          },
                        ]
                      : []),
                    ...(selectedTab === 'corporate' && country
                      ? [
                          {
                            trait_type: 'Country',
                            value: country,
                          },
                        ]
                      : []),
                  ],
                },
              );

              if (!metadata?.data?.uri) {
                toast.dismiss('loading');
                ShowAlert.error({
                  message: 'Failed to generate NFT metadata!',
                });
                return;
              }

              const mintNftIns = await program.methods
                .mintNft(metadata?.data?.uri, 'NFT Carbon', 'NCB', amount)
                .accounts({
                  signer: publicKey,
                  collectionMetadataAccount: collectionMetadataPDA,
                  collectionMasterEdition: collectionMasterEditionPDA,
                  nftMint: nftMint.publicKey,
                  metadataAccount: metadataAccount,
                  masterEdition: masterEditionPDA,
                  tokenAccount: tokenAccount,
                })
                .instruction();

              const modifyComputeUnits =
                ComputeBudgetProgram.setComputeUnitLimit({
                  units: 300_000,
                });

              const mintTxVer0 = await createTransactionV0(
                connection,
                publicKey,
                [modifyComputeUnits, mintNftIns],
                [nftMint],
              );

              if (!mintTxVer0) {
                toast.dismiss('loading');
                ShowAlert.error({
                  message: 'Failed to create mint transaction!',
                });
                return;
              }

              const result = (await sendTx({
                connection,
                wallet,
                transactions: burnTransactions,
                transactions2: [mintTxVer0],
              })) as {
                tx?: string;
                status: 'rejected' | 'fulfilled';
              }[];

              if (!Array.isArray(result)) {
                return;
              }

              let index = 0;
              const success = [];
              const fails = [];
              const certificateResult = [];
              for await (const res of result) {
                if (res.status === 'rejected') {
                  if (index === result.length - 1) {
                    certificateResult.push(
                      `<div>Create NFT certificate failed: <span class="text-danger">Error</span>.</div>`,
                    );
                  } else {
                    fails.push(
                      `<div>Burn failed ${Number(Big(allMints.find((item) => item?.mint === mints?.[index])?.amount || 0).toFixed(4)).toLocaleString('en-US')} Carbon: <span class="text-danger">Error</span>.</div>`,
                    );
                  }
                }

                if (res.status === 'fulfilled') {
                  if (index === result.length - 1) {
                    certificateResult.push(
                      `<div>Create NFT certificate successfully: <a class="underline" href="https://explorer.solana.com/tx/${res?.tx}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a></div>`,
                    );
                  } else {
                    success.push(
                      `<div>Burn successfully ${Number(Big(allMints.find((item) => item?.mint === mints?.[index])?.amount || 0).toFixed(4)).toLocaleString('en-US')} Carbon: <a class="underline" href="https://explorer.solana.com/tx/${res?.tx}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a></div>`,
                    );
                  }
                }
                index++;
              }

              const merged = `<div class="flex flex-col gap-2">${[...success, ...fails, ...certificateResult].join('')}</div>`;

              if (success.length > 0) {
                mutate();
                setName('');
                setProjectType('');
                setProjectLocation('');
                setReason('');
                setAddress('');
                setCountry('');
                setReason('');
                onClose();
                ShowAlert.success({
                  message: merged,
                });
                return;
              }

              if (fails.length > 0) {
                if (success.length > 0) {
                  mutate();
                  setName('');
                  setProjectType('');
                  setProjectLocation('');
                  setReason('');
                  setAddress('');
                  setCountry('');
                  setReason('');
                  onClose();
                }
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
              setLoading(false);
              toast.dismiss('loading');
            }
          }}
        >
          {loading ? 'Creating' : 'Create'}
        </DCarbonButton>
      }
      hideCloseButton
      centeredTitle
      classNames={{
        title: 'text-[23px] font-semibold',
        body: 'pt-0 mt-2',
      }}
    >
      <div className="flex flex-col gap-2 items-center mb-2">
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
            panel: 'pt-[16px] pb-0 w-full',
            base: 'sticky top-0 z-50 bg-white',
          }}
          fullWidth
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as TTab)}
        >
          <Tab key="individual" title="Individual">
            <CertificateIndividual
              amount={amount}
              name={name}
              setName={setName}
              isNameInvalid={isNameInvalid}
              setIsNameInvalid={setIsNameInvalid}
              projectType={projectType}
              setProjectType={setProjectType}
              isProjectTypeInvalid={isProjectTypeInvalid}
              setIsProjectTypeInvalid={setIsProjectTypeInvalid}
              projectLocation={projectLocation}
              setProjectLocation={setProjectLocation}
              isProjectLocationInvalid={isProjectLocationInvalid}
              setIsProjectLocationInvalid={setIsProjectLocationInvalid}
              reason={reason}
              setReason={setReason}
              loading={loading}
            />
          </Tab>
          <Tab key="corporate" title="Corporate">
            <CertificateCorporate
              amount={amount}
              name={name}
              setName={setName}
              isNameInvalid={isNameInvalid}
              setIsNameInvalid={setIsNameInvalid}
              projectType={projectType}
              setProjectType={setProjectType}
              isProjectTypeInvalid={isProjectTypeInvalid}
              setIsProjectTypeInvalid={setIsProjectTypeInvalid}
              projectLocation={projectLocation}
              setProjectLocation={setProjectLocation}
              isProjectLocationInvalid={isProjectLocationInvalid}
              setIsProjectLocationInvalid={setIsProjectLocationInvalid}
              reason={reason}
              setReason={setReason}
              address={address}
              setAddress={setAddress}
              isAddressInvalid={isAddressInvalid}
              setIsAddressInvalid={setIsAddressInvalid}
              country={country}
              setCountry={setCountry}
              isCountryInvalid={isCountryInvalid}
              setIsCountryInvalid={setIsCountryInvalid}
              loading={loading}
            />
          </Tab>
        </Tabs>
      </div>
    </DCarbonModal>
  );
}

export default CertificateModal;
