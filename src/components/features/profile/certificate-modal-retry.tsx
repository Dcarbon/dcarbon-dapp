'use client';

import React, { useState } from 'react';
import { doGetMintMetada, Metadata } from '@/adapters/common';
import {
  doGenerateBurnMetadata,
  doGenerateNftMetadata,
  doModifyBurnHistoryStatus,
} from '@/adapters/user';
import { ShowAlert } from '@/components/common/toast';
import { THROW_EXCEPTION } from '@/utils/constants';
import { logger } from '@/utils/helpers/common';
import { Tab, Tabs } from '@nextui-org/react';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import certificateIcon from 'public/images/projects/cerfiticate-icon.png';

import DCarbonButton from '../../common/button';
import DCarbonModal from '../../common/modal';
import CertificateCorporate from './list-carbon/certificate-corporate';
import CertificateIndividual from './list-carbon/certificate-individual';

dayjs.extend(utc);

type TTab = 'individual' | 'corporate';

interface IRetryModalOption {
  index: number;
  groupTx: string;
  amount: number;
  mints: string[];
  burnTxs: string[];
  retryMintNftFn: (
    index: number,
    groupTx: string,
    amount: number,
    mints: string[],
    burnTxs: string[],
    metadata?: Metadata,
    uri?: string,
  ) => Promise<void>;
}

function CertificateRetryModal({
  isOpen,
  onClose,
  onBack,
  retryOption,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  retryOption?: IRetryModalOption;
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
    <>
      <DCarbonModal
        onClose={onClose}
        isOpen={isOpen}
        title="Certificate Info"
        icon={certificateIcon.src}
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

              if (!retryOption?.amount || retryOption?.amount === 0) {
                ShowAlert.error({ message: 'Please input amount of Carbon!' });
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

              if (!country) {
                setIsCountryInvalid(true);
                return;
              }

              if (selectedTab === 'corporate') {
                if (!address) {
                  setIsAddressInvalid(true);
                  return;
                }
              }

              setLoading(true);
              ShowAlert.loading({
                message: 'Generate transaction to burn Carbon...',
              });
              try {
                let projectName: string = '';
                if (retryOption?.burnTxs && retryOption?.burnTxs.length > 0) {
                  ShowAlert.loading({ message: 'Generating certificate...' });

                  const mintMetadataResult = await doGetMintMetada(
                    publicKey.toBase58(),
                    retryOption?.mints?.join(',') || '',
                  );

                  const newProjectName =
                    mintMetadataResult?.data?.attributes?.find((attr) =>
                      ['Project Name', 'Project'].includes(attr.trait_type),
                    )?.value;

                  if (newProjectName) {
                    projectName = newProjectName;
                  }
                  const pdfResponse = await doGenerateBurnMetadata(
                    publicKey.toBase58(),
                    {
                      amount: retryOption?.amount,
                      transactions: retryOption?.burnTxs,
                      date: dayjs().utc().unix(),
                      owner: name,
                      project_name: projectName,
                    },
                  );
                  if (!pdfResponse?.data?.url) {
                    ShowAlert.dismiss('loading');
                    ShowAlert.error({
                      message: 'Failed to generate certificate!',
                    });
                    await doModifyBurnHistoryStatus({
                      group_tx: retryOption?.groupTx,
                      status: 'error',
                    }).catch((e) => {
                      const error = e as Error;
                      logger({ message: error?.toString(), type: 'ERROR' });
                    });
                    return;
                  }

                  ShowAlert.loading({
                    message: 'Generating NFT certificate metadata...',
                  });
                  const metadataInput: Metadata = {
                    name: 'DCO2 Certificate',
                    symbol: 'DCC',
                    image: 'image',
                    attributes: [
                      {
                        trait_type: 'name',
                        value: name,
                      },
                      {
                        trait_type: 'amount',
                        value: retryOption?.amount.toString(),
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
                      {
                        trait_type: 'burned_at',
                        value: dayjs.utc().format('DD.MM.YYYY'),
                      },
                      ...(projectName
                        ? [{ trait_type: 'project_name', value: projectName }]
                        : []),
                      ...(retryOption?.burnTxs?.map((tx) => ({
                        trait_type: 'burn_tx',
                        value: tx || '',
                      })) || []),
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

                      {
                        trait_type: 'country',
                        value: country,
                      },
                    ],
                  };
                  const metadata = await doGenerateNftMetadata(
                    publicKey.toBase58(),
                    metadataInput,
                  );
                  if (!metadata?.data?.uri) {
                    ShowAlert.dismiss('loading');
                    ShowAlert.error({
                      message: 'Failed to generate NFT Certificate metadata!',
                    });
                    await doModifyBurnHistoryStatus({
                      group_tx: retryOption?.groupTx,
                      status: 'error',
                    }).catch((e) => {
                      const error = e as Error;
                      logger({ message: error?.toString(), type: 'ERROR' });
                    });
                    return;
                  }
                  if (retryOption && retryOption.retryMintNftFn) {
                    await retryOption.retryMintNftFn(
                      retryOption.index,
                      retryOption.groupTx,
                      retryOption.amount,
                      retryOption.mints,
                      retryOption.burnTxs,
                      metadataInput,
                      metadata.data.uri,
                    );
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
                setName('');
                setProjectType('');
                setProjectLocation('');
                setReason('');
                setAddress('');
                setCountry('');
                setReason('');
                onClose();
                setLoading(false);
                ShowAlert.dismiss('loading');
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
                amount={retryOption?.amount || 0}
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
                country={country}
                setCountry={setCountry}
                isCountryInvalid={isCountryInvalid}
                setIsCountryInvalid={setIsCountryInvalid}
                loading={loading}
              />
            </Tab>
            <Tab key="corporate" title="Corporation">
              <CertificateCorporate
                amount={retryOption?.amount || 0}
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
    </>
  );
}

export default CertificateRetryModal;
export type { IRetryModalOption };
