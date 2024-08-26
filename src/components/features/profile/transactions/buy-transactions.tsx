import React, { useMemo, useState } from 'react';
import NextImage from 'next/image';
import { useSearchParams } from 'next/navigation';
import { doGetListTx } from '@/adapters/user';
import DCarbonLoading from '@/components/common/loading/base-loading';
import { QUERY_KEYS } from '@/utils/constants';
import {
  Button,
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
import { env } from 'env.mjs';
import logo from 'public/images/common/logo.svg';
import solScanIcon from 'public/images/common/sol-scan.png';
import solanaExplorerIcon from 'public/images/common/solana-explorer.png';
import useSWR from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';
import { ShowAlert } from '@components/common/toast';
import { shortAddress } from '@utils/helpers/common';

import copyIcon from '../../../../../public/images/common/copy.svg';

const rowsPerPage = 10;
const txColumns = [
  {
    key: 'tx_time',
    label: 'Date',
  },
  {
    key: 'mint',
    label: 'Token address',
  },
  {
    key: 'quality',
    label: 'Quality',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'action',
    label: 'Action',
  },
];

const CarbonTransaction = () => {
  const [listTxPage, setListTxPage] = useState<number>(1);
  const { publicKey } = useWallet();
  const [, copy] = useCopyToClipboard();
  const searchParams = useSearchParams();

  const { data: listTx, isLoading: listTxLoading } = useSWR(
    () =>
      publicKey &&
      listTxPage &&
      searchParams.get('tab') === 'transaction' &&
      searchParams.get('type') === 'buy'
        ? [
            QUERY_KEYS.USER.GET_LIST_TX.CARBON,
            searchParams.get('type'),
            publicKey,
            listTxPage,
          ]
        : null,
    ([, , wallet, page]) => {
      if (
        !wallet ||
        !page ||
        (searchParams.get('tab') !== 'transaction' &&
          searchParams.get('type') !== 'buy')
      ) {
        return null;
      }
      return doGetListTx({
        wallet: wallet?.toBase58(),
        page,
        limit: rowsPerPage,
      });
    },
    {
      revalidateOnMount: true,
      keepPreviousData: true,
    },
  );
  const listTxLoadingState = listTxLoading ? 'loading' : 'idle';

  const listTxPages = useMemo(() => {
    return listTx?.paging?.total
      ? Math.ceil(listTx?.paging?.total / rowsPerPage)
      : 0;
  }, [listTx?.paging?.total]);

  const renderCell = React.useCallback(
    (user: any, columnKey: React.Key, type?: 'carbon' | 'burn') => {
      const cellValue = user[columnKey as keyof any];

      switch (columnKey) {
        case 'mint': {
          return (
            <div className="text-sm font-light flex gap-[5px] items-center">
              <span className="text-[#4F4F4F]">
                {shortAddress('text', cellValue)}
              </span>
              <Button
                onClick={async () => {
                  await copy(cellValue || '');
                  ShowAlert.success({ message: 'Copied to clipboard' });
                }}
                variant="light"
                isIconOnly
                className="h-[24px] min-w-[24px] w-[24px] data-[hover=true]:bg-transparent"
                radius="none"
                disableRipple
                disableAnimation
              >
                <Image
                  src={copyIcon.src}
                  alt="Copy"
                  width={20}
                  height={20}
                  as={NextImage}
                  draggable={false}
                />
              </Button>
            </div>
          );
        }
        case 'metadata': {
          return (
            <span className="text-base">
              {cellValue?.attributes?.find(
                (att: any) => att?.trait_type === 'name',
              )?.value || ''}
            </span>
          );
        }
        case 'tx_time': {
          return (
            <span className="text-[#4F4F4F]">
              {new Date(cellValue).toLocaleString()}
            </span>
          );
        }

        case 'name': {
          return <span className="text-base">{cellValue}</span>;
        }

        case 'action': {
          let urlSolScan = `https://explorer.solana.com/address/${user?.token_account || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
          let urlSolanaIo = `https://solscan.io/account/${user?.token_account || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
          if (type === 'carbon') {
            urlSolScan = `https://explorer.solana.com/tx/${user?.tx || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
            urlSolanaIo = `https://solscan.io/tx/${user?.tx || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
          }
          return (
            <div className="relative flex gap-4">
              <Link href={urlSolScan} isExternal>
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

              <Link href={urlSolanaIo} isExternal>
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
        case 'amount': {
          if (type === 'carbon') {
            return (
              <div className="relative flex gap-2 items-center text-base">
                <Image
                  src={user?.payment_info?.currency?.icon}
                  alt={user?.payment_info?.currency?.symbol}
                  as={NextImage}
                  width={24}
                  height={24}
                  draggable={false}
                  className="min-w-[24px]"
                />
                <div className={'flex flex-col'}>
                  <span className={'text-sm'}>
                    {(+user?.amount || 0)?.toLocaleString('en-US')}{' '}
                    {user?.payment_info?.currency?.symbol}
                  </span>
                  <span className={'text-xs text-[#697077]'}>
                    {'≈ '}
                    {Number(
                      (
                        (+user?.amount || 0) *
                        (user?.payment_info?.exchange_rate || 1)
                      ).toFixed(1),
                    )?.toLocaleString('en-US')}
                    {'$'}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div className="relative flex gap-2 items-center text-base">
              <Image
                src={logo.src}
                alt="DCarbon"
                as={NextImage}
                width={24}
                height={24}
                draggable={false}
                className="min-w-[24px]"
              />

              <span>
                {(+user?.amount || 0)?.toLocaleString('en-US')}{' '}
                {user?.name || 'Carbon'}
              </span>
            </div>
          );
        }
        case 'quality': {
          return (
            <div className="relative flex gap-2 items-center text-base">
              <Image
                src={logo.src}
                alt="DCarbon"
                as={NextImage}
                width={24}
                height={24}
                draggable={false}
                className="min-w-[24px]"
              />
              <span className="text-base">
                {(+user?.quality || 0)?.toLocaleString('en-US')}
              </span>
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
        isLoading={listTxLoading}
        emptyContent={'No transaction found!'}
      >
        {(item) => (
          <TableRow key={item.tx}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey, 'carbon')}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CarbonTransaction;
