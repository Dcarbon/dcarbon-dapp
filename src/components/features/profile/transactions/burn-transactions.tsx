'use client';

import React, { useMemo, useState } from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  doGetListBurnTx,
  doModifyBurnHistoryStatus,
  TBurnStatus,
} from '@/adapters/user';
import DCarbonLoading from '@/components/common/loading/base-loading';
import { QUERY_KEYS, THROW_EXCEPTION } from '@/utils/constants';
import { Metadata } from '@adapters/common';
import { EMintingStatus } from '@enums/burn.enum';
import {
  Button,
  Chip,
  Image,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import dayjs from 'dayjs';
import { env } from 'env.mjs';
import logo from 'public/images/common/logo.svg';
import solScanIcon from 'public/images/common/sol-scan.png';
import solanaExplorerIcon from 'public/images/common/solana-explorer.png';
import useSWR from 'swr';
import { ShowAlert } from '@components/common/toast';
import NftModal from '@components/features/certificate/nftModal';
import CertificateRetryModal, {
  IRetryModalOption,
} from '@components/features/profile/certificate-modal-retry';
import { mintNft } from '@utils/contract/contract.util';

const rowsPerPage = 10;
const txColumns = [
  {
    key: 'tx_time',
    label: 'Date',
  },
  {
    key: 'amount',
    label: 'Token DCO2',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'action',
    label: 'Action',
  },
];

const statusColorMap: any = {
  [EMintingStatus.FINISHED]: 'success',
  [EMintingStatus.ERROR]: 'danger',
  [EMintingStatus.REJECTED]: 'danger',
  [EMintingStatus.MINTING]: 'primary',
};

const BurnTransaction = () => {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [loading, setLoading] = useState<number>(-1);
  const [listTxPage, setListTxPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const [visibleNftSuccess, setVisibleNftSuccess] = useState<boolean>(false);
  const certificateModalState = useDisclosure();
  const [burnModalInfo, setBurnModalInfo] = useState<IRetryModalOption>();
  const [nftSuccessData, setNftSuccessData] = useState<{
    name: string;
    burned_at: string;
    burn_tx: string[];
    amount: string;
    project_name: string;
  }>();
  const {
    data: listTx,
    isLoading: listTxLoading,
    mutate,
    isValidating,
  } = useSWR(
    () =>
      publicKey &&
      listTxPage &&
      searchParams.get('tab') === 'transaction' &&
      searchParams.get('type') === 'burn'
        ? [QUERY_KEYS.USER.GET_LIST_TX.BURN, publicKey, listTxPage]
        : null,
    ([, wallet, page]) => {
      if (
        !wallet ||
        !page ||
        (searchParams.get('tab') !== 'transaction' &&
          searchParams.get('type') !== 'burn')
      ) {
        return null;
      }
      return doGetListBurnTx({
        wallet: wallet?.toBase58(),
        page,
        limit: rowsPerPage,
      });
    },
    {
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
    },
  );
  const listTxLoadingState = listTxLoading || isValidating ? 'loading' : 'idle';

  const openExplorer = async (type: 'sol_ex' | 'sol_io', tx: string) => {
    const urlSolScan = `https://explorer.solana.com/tx/${tx || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
    const urlSolanaIo = `https://solscan.io/tx/${tx || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
    if (type === 'sol_ex') {
      window.open(urlSolScan, '_blank');
    } else window.open(urlSolanaIo, '_blank');
  };
  const modifyBurnStatus = async (groupTx: string, status: TBurnStatus) => {
    await doModifyBurnHistoryStatus({
      group_tx: groupTx,
      status,
    }).catch((e) => {
      ShowAlert.error({
        message: 'Something went wrong',
      });
      throw e;
    });
  };

  const retryMintNft = async (
    index: number,
    groupTx: string,
    amount: number,
    mints: string[],
    burnTxs: string[],
    metadata?: Metadata,
    uri?: string,
  ) => {
    if (!publicKey || !wallet || !anchorWallet || !connection) {
      ShowAlert.error({ message: 'Please connect to wallet first!' });
      return;
    }
    if (!uri || !metadata || Object.keys(metadata).length === 0) {
      setBurnModalInfo({
        index,
        burnTxs,
        amount,
        mints,
        groupTx,
        retryMintNftFn: retryMintNft,
      });
      certificateModalState.onOpen();
      return;
    }
    if (!amount || amount <= 0) {
      ShowAlert.error({
        message: 'Failed to Mint NFT Certificate: Invalid amount!',
      });
      return;
    }
    ShowAlert.loading({ message: 'Minting NFT certificate...' });
    setLoading(index);
    let alertResult: any | undefined;
    let errorAlertResult: any | undefined;
    let isSuccess = false;
    let tx;
    try {
      const result = await mintNft(
        {
          connection,
          anchorWallet,
          wallet,
          signer: publicKey,
        },
        {
          uri,
          amount,
          beforeSendTxFn: async () =>
            await modifyBurnStatus(groupTx, 'minting'),
        },
      );
      if (
        result?.error &&
        result?.error !== THROW_EXCEPTION.USER_REJECTED_REQUEST
      ) {
        alertResult = `<div>Mint NFT certificate failed: <span class="text-danger">Error</span>.</div>`;
      }
      if (!result?.error) {
        if (result?.tx) {
          isSuccess = true;
          tx = result?.tx;
          alertResult = `<div>Mint NFT certificate successfully: <a style="display: block" class="underline" href="https://explorer.solana.com/tx/${result.tx}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}" rel="noopener noreferrer" target="_blank">View transaction</a></div>`;
        } else {
          errorAlertResult = `<div>Mint NFT certificate failed: <span class="text-danger">Error</span>.</div>`;
        }
      }
      ShowAlert.dismiss('loading');
    } catch (e) {
      errorAlertResult = `<div>Mint NFT certificate failed: <span class="text-danger">Error</span>.</div>`;
      ShowAlert.dismiss('loading');
    } finally {
      if (alertResult) {
        const merged = `<div class="flex flex-col gap-2">${alertResult}</div>`;
        ShowAlert.success({
          message: merged,
        });
      } else if (errorAlertResult) {
        await doModifyBurnHistoryStatus({
          group_tx: groupTx,
          status: 'error',
        }).catch((e) => {});
        const merged = `<div class="flex flex-col gap-2">${errorAlertResult}</div>`;
        ShowAlert.error({
          message: merged,
        });
        await mutate();
      }
      if (isSuccess) {
        await doModifyBurnHistoryStatus({
          group_tx: groupTx,
          status: 'finished',
          mint_tx: tx,
        }).catch((e) => {});
        const certName = metadata?.attributes.find(
          (attr) => attr.trait_type === 'name',
        );
        const projectName = metadata?.attributes.find(
          (attr) => attr.trait_type === 'project_name',
        );
        const burnTxs = metadata?.attributes?.filter(
          (attr) => attr.trait_type === 'burn_tx',
        );
        const burnResult = (burnTxs || []).map((attr) => attr.value);
        setNftSuccessData({
          name: certName ? certName.value : 'DCO2 Certificate',
          amount: amount.toString(),
          burned_at: dayjs.utc().format('DD.MM.YYYY'),
          burn_tx: burnResult,
          project_name: projectName ? projectName.value : 'multiple projects',
        });
        setVisibleNftSuccess(true);
        await mutate();
      }
      setLoading(-1);
    }
  };

  const listTxPages = useMemo(() => {
    return listTx?.paging?.total
      ? Math.ceil(listTx?.paging?.total / rowsPerPage)
      : 0;
  }, [listTx?.paging?.total]);

  const renderCell = React.useCallback(
    (
      index: number,
      user: any,
      columnKey: React.Key,
      type?: 'carbon' | 'burn',
      loading?: number,
    ) => {
      let cellValue = user[columnKey as keyof any];

      switch (columnKey) {
        case 'amount': {
          return (
            <div className="relative flex gap-2 items-center text-base">
              <Image
                src={logo.src}
                alt="DCO2"
                as={NextImage}
                width={24}
                height={24}
                draggable={false}
                className="min-w-[24px]"
              />
              <span className="text-base">
                {(+user?.amount || 0)?.toLocaleString('en-US')}
              </span>
            </div>
          );
        }
        case 'tx_time': {
          return (
            <span className="text-[#4F4F4F]">
              {new Date(cellValue).toLocaleString()}
            </span>
          );
        }
        case 'status': {
          cellValue =
            loading !== -1 && index === loading
              ? EMintingStatus.MINTING
              : cellValue;
          let text = 'Minting';
          switch (cellValue) {
            case EMintingStatus.FINISHED: {
              text = 'Done';
              break;
            }
            case EMintingStatus.ERROR:
            case EMintingStatus.REJECTED: {
              text = 'Error';
              break;
            }
          }
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[cellValue as any]}
              size="sm"
              variant="dot"
            >
              {text}
            </Chip>
          );
        }
        case 'action': {
          if (
            [EMintingStatus.ERROR, EMintingStatus.REJECTED].includes(
              user?.status,
            )
          ) {
            return (
              <Button
                color="primary"
                variant="flat"
                size="sm"
                isLoading={loading !== -1 && index === loading}
                isDisabled={loading !== -1 && index !== loading}
                onClick={() =>
                  retryMintNft(
                    index,
                    user?.group_tx,
                    user?.amount || 0,
                    user?.mints,
                    user?.txs,
                    user?.metadata,
                    user?.metadata_uri,
                  )
                }
              >
                {loading !== -1 && index === loading ? '' : 'Retry'}
              </Button>
            );
          } else if (user?.status === EMintingStatus.MINTING) {
            return '';
          }
          return (
            <div className="relative flex gap-4">
              <Link
                isExternal
                onClick={() => openExplorer('sol_ex', user?.mint_tx)}
              >
                <Image
                  src={solanaExplorerIcon.src}
                  alt="Solana Explorer"
                  as={NextImage}
                  width={24}
                  height={24}
                  draggable={false}
                  radius="none"
                  className="min-w-[24px]"
                />
              </Link>

              <Link
                isExternal
                onClick={() => openExplorer('sol_io', user?.txs)}
              >
                <Image
                  src={solScanIcon.src}
                  alt="Solscan"
                  as={NextImage}
                  width={24}
                  height={24}
                  draggable={false}
                  radius="none"
                  className="min-w-[24px]"
                />
              </Link>
            </div>
          );
        }
        default:
          return cellValue;
      }
    },
    [loading],
  );
  return (
    <>
      <Table
        aria-label="BurnTransaction Table"
        shadow="none"
        radius="none"
        classNames={{
          th: 'bg-white h-[56px] border-b-1 border-[#DDE1E6] text-sm text-[#4F4F4F] font-medium',
          td: 'h-[48px] rounded-[4px]',
          tbody: '[&>*:nth-child(odd)]:bg-[#F6F6F6]',
          wrapper: 'p-0',
        }}
        bottomContent={
          listTxPages > 1 ? (
            <div className="flex w-full justify-center z-[11]">
              <Pagination
                isCompact
                showControls
                showShadow
                color="success"
                page={listTxPage}
                total={listTxPages}
                onChange={(page) => setListTxPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={txColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          // items={listTx?.data || []}
          loadingContent={<DCarbonLoading />}
          loadingState={listTxLoadingState}
          emptyContent={'No transaction found!'}
        >
          {(listTx?.data || []).map((item, idx) => (
            <TableRow key={item.txs[0]}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(idx, item, columnKey, 'burn', loading)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CertificateRetryModal
        isOpen={certificateModalState.isOpen}
        onClose={certificateModalState.onClose}
        onBack={() => {
          certificateModalState.onClose();
        }}
        retryOption={burnModalInfo}
      />
      {nftSuccessData?.name &&
        nftSuccessData?.burn_tx &&
        nftSuccessData?.burn_tx?.length > 0 &&
        nftSuccessData?.amount && (
          <NftModal
            visible={visibleNftSuccess}
            setVisible={setVisibleNftSuccess}
            name={nftSuccessData?.name}
            burned_at={dayjs.utc().format('DD.MM.YYYY')}
            burn_tx={nftSuccessData?.burn_tx}
            amount={nftSuccessData?.amount.toString()}
            project_name={nftSuccessData?.project_name}
          />
        )}
    </>
  );
};

export default BurnTransaction;
