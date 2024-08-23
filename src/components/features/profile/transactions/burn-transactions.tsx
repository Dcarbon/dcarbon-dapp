import React, { useMemo, useState } from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import { doGetListBurnTx } from '@/adapters/user';
import DCarbonLoading from '@/components/common/loading/base-loading';
import { QUERY_KEYS } from '@/utils/constants';
import { EMintingStatus } from '@enums/burn.enum';
import {
  Image,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sleep } from '@toruslabs/base-controllers';
import { env } from 'env.mjs';
import logo from 'public/images/common/logo.svg';
import solScanIcon from 'public/images/common/sol-scan.png';
import solanaExplorerIcon from 'public/images/common/solana-explorer.png';
import useSWR from 'swr';
import DCarbonButton from '@components/common/button';
import Tag, { TTagColor } from '@components/common/tag';

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

const BurnTransaction = () => {
  const [listTxPage, setListTxPage] = useState<number>(1);
  const { publicKey } = useWallet();
  const searchParams = useSearchParams();

  const { data: listTx, isLoading: listTxLoading } = useSWR(
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
    },
  );
  const listTxLoadingState = listTxLoading ? 'loading' : 'idle';

  const openExplorer = async (type: 'sol_ex' | 'sol_io', txs: string[]) => {
    for (let i = 0; i < txs.length; i++) {
      const urlSolScan = `https://explorer.solana.com/tx/${txs[i] || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
      const urlSolanaIo = `https://solscan.io/tx/${txs[i] || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
      if (type === 'sol_ex') {
        window.open(urlSolScan, '_blank');
        await sleep(10);
      } else window.open(urlSolanaIo, '_blank');
    }
  };

  const listTxPages = useMemo(() => {
    return listTx?.paging?.total
      ? Math.ceil(listTx?.paging?.total / rowsPerPage)
      : 0;
  }, [listTx?.paging?.total]);

  const renderCell = React.useCallback(
    (user: any, columnKey: React.Key, type?: 'carbon' | 'burn') => {
      const cellValue = user[columnKey as keyof any];

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
          let color: TTagColor = 'blue';
          let text = 'Minting';
          switch (cellValue) {
            case EMintingStatus.FINISHED: {
              color = 'green';
              text = 'Successful';
              break;
            }
            case EMintingStatus.ERROR:
            case EMintingStatus.REJECTED: {
              color = 'red';
              text = 'Error';
              break;
            }
          }
          return <Tag color={color} text={text} />;
        }
        case 'action': {
          if (
            [EMintingStatus.ERROR, EMintingStatus.REJECTED].includes(
              user?.status,
            )
          ) {
            return (
              <DCarbonButton color="primary" className="min-w-[70px] h-[26px]">
                Retry
              </DCarbonButton>
            );
          } else if (user?.status === EMintingStatus.MINTING) {
            return '';
          }
          return (
            <div className="relative flex gap-4">
              <Link
                isExternal
                onClick={() => openExplorer('sol_ex', user?.txs)}
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
    [],
  );

  return (
    <Table
      aria-label="Transaction Table"
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
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={listTx?.data || []}
        loadingContent={<DCarbonLoading />}
        loadingState={listTxLoadingState}
        emptyContent={'No transaction found!'}
      >
        {(item) => (
          <TableRow key={item.txs[0]}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey, 'burn')}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default BurnTransaction;
