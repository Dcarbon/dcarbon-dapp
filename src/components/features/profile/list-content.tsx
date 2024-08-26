'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import NextImage from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { doGetListCarbon, doGetListCertificate } from '@/adapters/user';
import DCarbonButton from '@/components/common/button';
import DCarbonLoading from '@/components/common/loading/base-loading';
import { ShowAlert } from '@/components/common/toast';
import { QUERY_KEYS, WEB_ROUTES } from '@/utils/constants';
import { getAllCacheDataByKey, shortAddress } from '@/utils/helpers/common';
import {
  Button,
  Image,
  Link,
  Pagination,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  useDisclosure,
} from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { env } from 'env.mjs';
import copyIcon from 'public/images/common/copy.svg';
import logo from 'public/images/common/logo.svg';
import solScanIcon from 'public/images/common/sol-scan.png';
import solanaExplorerIcon from 'public/images/common/solana-explorer.png';
import viewIcon from 'public/images/common/view-icon.svg';
import useSWR, { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';

import BurnModal from './list-carbon/burn-modal';
import SwapButton from './list-carbon/swap-button';
import Transactions from './transactions';

const rowsPerPage = 10;

type tabTypes = 'certificated' | 'transaction' | 'list-carbon';

function CertificateListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set());
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { publicKey } = useWallet();
  const [listCarbonPage, setListCarbonPage] = useState<number>(1);
  const [listCertificatePage, setListCertificatePage] = useState<number>(1);
  const { cache } = useSWRConfig();
  const listCarbonCacheData = getAllCacheDataByKey(
    QUERY_KEYS.USER.GET_LIST_CARBON,
    cache,
    'data',
  );
  const [, copy] = useCopyToClipboard();
  const [selectedTab, setSelectedTab] = useState<tabTypes>(
    (searchParams.get('tab') as tabTypes) || 'certificated',
  );
  const publicKeyPrevRef = useRef(publicKey);

  const reset = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  useEffect(() => {
    if (
      publicKey &&
      publicKeyPrevRef.current?.toBase58() !== publicKey.toBase58()
    ) {
      setSelectedKeys(new Set());
      publicKeyPrevRef.current = publicKey;
    }
  }, [publicKey]);

  useEffect(() => {
    setSelectedTab((prev) => {
      if (prev !== searchParams.get('tab')) {
        return (searchParams.get('tab') as tabTypes) || 'certificated';
      }

      return prev;
    });
  }, [searchParams]);

  const { data, isLoading, mutate } = useSWR(
    () =>
      publicKey && listCarbonPage && selectedTab === 'list-carbon'
        ? [QUERY_KEYS.USER.GET_LIST_CARBON, publicKey, listCarbonPage]
        : null,
    ([, wallet, page]) => {
      if (!wallet || !page || selectedTab !== 'list-carbon') {
        return null;
      }
      return doGetListCarbon({
        wallet: wallet?.toBase58(),
        page,
        limit: rowsPerPage,
      });
    },
    {
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );

  const { data: listCertificate, isLoading: listCertificateLoading } = useSWR(
    () =>
      publicKey && listCertificatePage && selectedTab === 'certificated'
        ? [QUERY_KEYS.USER.GET_LIST_CERTIFICATE, publicKey, listCertificatePage]
        : null,
    ([, wallet, page]) => {
      if (!wallet || !page || selectedTab !== 'certificated') {
        return null;
      }
      return doGetListCertificate({
        wallet: wallet?.toBase58(),
        page,
        limit: rowsPerPage,
      });
    },
    {
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );

  const handleChangeTab = useCallback(
    (tab: tabTypes) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('type');
      if (tab === 'transaction') {
        params.set('type', 'carbon');
      }
      params.set('tab', tab);

      const newParams = params.toString();
      setSelectedTab(tab);
      router.push(pathname + '?' + newParams, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const listCarbonPages = useMemo(() => {
    return data?.paging?.total
      ? Math.ceil(data?.paging?.total / rowsPerPage)
      : 0;
  }, [data?.paging?.total]);

  const listCertificatePages = useMemo(() => {
    return listCertificate?.paging?.total
      ? Math.ceil(listCertificate?.paging?.total / rowsPerPage)
      : 0;
  }, [listCertificate?.paging?.total]);

  const listCarbonLoadingState = isLoading ? 'loading' : 'idle';
  const listCertificateLoadingState = listCertificateLoading
    ? 'loading'
    : 'idle';

  const certificateColumns = [
    {
      key: 'created_at',
      label: 'Date',
    },
    {
      key: 'metadata',
      label: 'Name',
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

  const listCarbonColumns = [
    { key: 'mint', label: 'Token Address' },
    { key: 'attributes', label: 'Project Name' },
    {
      key: 'amount',
      label: 'Total Carbon',
    },
    {
      key: 'symbol',
      label: 'Token Symbol',
    },
    {
      key: 'action',
      label: 'Action',
    },
  ];

  const renderCell = React.useCallback(
    (
      user: any,
      columnKey: React.Key,
      type?: 'transaction' | 'list-carbon' | 'certificated',
    ) => {
      const cellValue = user[columnKey as keyof any];

      switch (columnKey) {
        case 'attributes': {
          const value =
            cellValue?.find(
              (att: any) =>
                att?.trait_type === 'Project Name' ||
                att?.trait_type === 'Project',
            )?.value || '';
          return (
            <span
              title={value}
              className="text-base line-clamp-1 max-w-[150px]"
            >
              {value}
            </span>
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

        case 'created_at': {
          if (type === 'certificated') {
            return (
              <span className="text-[#4F4F4F]">
                {cellValue === 'Calculating'
                  ? cellValue
                  : new Date(cellValue).toLocaleString()}
              </span>
            );
          }
          return (
            <span className="text-[#4F4F4F]">
              {new Date(cellValue).toLocaleString()}
            </span>
          );
        }

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
        case 'date': {
          return <span className="text-[#4F4F4F]">{cellValue}</span>;
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
        case 'symbol': {
          return <span className="text-base">{user?.symbol}</span>;
        }
        case 'action': {
          if (type === 'transaction' || type === 'list-carbon') {
            let urlSolScan = `https://explorer.solana.com/address/${user?.token_account || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
            let urlSolanaIo = `https://solscan.io/account/${user?.token_account || ''}${env.NEXT_PUBLIC_MODE === 'prod' ? '' : '?cluster=devnet'}`;
            if (type === 'transaction') {
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

          return (
            <div className="relative flex">
              <Link
                href={WEB_ROUTES.CERTIFICATE_DETAIL.replace(
                  '[id]',
                  user?.address || '',
                )}
                target="_blank"
              >
                <Image
                  src={viewIcon.src}
                  alt="View"
                  as={NextImage}
                  width={24}
                  height={24}
                  draggable={false}
                />
              </Link>
            </div>
          );
        }
        case 'amount': {
          if (type === 'transaction') {
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

          if (type === 'certificated') {
            return (
              <div className="relative flex gap-2 items-center text-base">
                {user?.metadata?.image ? (
                  <Image
                    src={user.metadata.image
                      .replace('https://arweave.dev', 'https://arweave.dev/raw')
                      .replace(
                        'https://arweave.net',
                        'https://arweave.net/raw',
                      )}
                    alt={
                      cellValue?.attributes?.find(
                        (att: any) => att?.trait_type === 'name',
                      )?.value || ''
                    }
                    as={NextImage}
                    width={24}
                    height={24}
                    draggable={false}
                    className="min-w-[24px]"
                  />
                ) : null}

                <span>
                  {Number(
                    user?.metadata?.attributes?.find(
                      (att: any) => att?.trait_type === 'amount',
                    )?.value || 0,
                  )?.toLocaleString('en-US')}
                </span>
              </div>
            );
          }

          return (
            <div className="relative flex gap-2 items-center text-base">
              <Image
                src={user?.image || logo.src}
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
            <span className="text-base">
              {(+user?.quality || 0)?.toLocaleString('en-US')}
            </span>
          );
        }
        default:
          return cellValue;
      }
    },
    [],
  );

  const totalAmountWillBurn = useMemo(() => {
    if (selectedKeys.size === 0) {
      return 0;
    }
    if (selectedKeys === 'all') {
      return data?.common?.total || 0;
    }
    let count = 0;
    selectedKeys.forEach((value: any) => {
      const newAmount = +(
        listCarbonCacheData?.find((item) => item.mint === value)?.amount || 0
      );
      count += newAmount;
    });

    return count;
  }, [data?.common?.total, listCarbonCacheData, selectedKeys]);

  const listMints = useMemo(() => {
    if (selectedKeys === 'all') {
      return [];
    }

    return Array.from(selectedKeys).map((value: any) => {
      const currentRecord = listCarbonCacheData?.find(
        (item) => item.mint === value,
      );
      return {
        mint: currentRecord?.mint || '',
        amount: currentRecord?.amount || 0,
      };
    });
  }, [listCarbonCacheData, selectedKeys]);

  return (
    <>
      <Tabs
        key="mode"
        variant="light"
        destroyInactiveTabPanel
        aria-label="Certificate List"
        classNames={{
          base: 'flex',
          tab: 'h-[49px] w-full sm:min-w-[204px] data-[focus-visible=true]:outline-0',
          cursor: 'shadow-none bg-[#F6F6F6]',
          tabContent:
            'xl:text-[23px] font-medium group-data-[selected=true]:text-[#21272A]',
          tabList: 'p-0',
          panel: 'pt-[24px] pb-0 w-full',
        }}
        selectedKey={selectedTab}
        onSelectionChange={(tab) => handleChangeTab(tab as tabTypes)}
      >
        <Tab key="certificated" title="Certificated">
          <Table
            aria-label="Certificated Table"
            shadow="none"
            radius="none"
            classNames={{
              th: 'bg-white h-[56px] border-b-1 border-[#DDE1E6] text-sm text-[#4F4F4F] font-medium',
              td: 'h-[48px] rounded-[4px]',
              tbody: '[&>*:nth-child(odd)]:bg-[#F6F6F6]',
              wrapper: 'p-0',
            }}
            bottomContent={
              listCertificatePages > 1 ? (
                <div className="flex w-full justify-center z-[11]">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="success"
                    page={listCertificatePage}
                    total={listCertificatePages}
                    onChange={(page) => setListCertificatePage(page)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader columns={certificateColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={listCertificate?.data || []}
              emptyContent={'No certificated found!'}
              loadingContent={<DCarbonLoading />}
              loadingState={listCertificateLoadingState}
              isLoading={listCertificateLoading}
            >
              {(item) => (
                <TableRow key={item.address}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(item, columnKey, 'certificated')}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Tab>
        <Tab key="transaction" title="Transaction">
          <Transactions />
        </Tab>

        <Tab key="list-carbon" title="List Carbon">
          <div className="mb-2 flex gap-4">
            <DCarbonButton
              color="primary"
              className="min-w-[150px] h-[34px]"
              onClick={onOpen}
            >
              Burn
            </DCarbonButton>
            <SwapButton
              mints={
                selectedKeys === 'all'
                  ? data?.common?.all_data?.map((item) => ({
                      mint: item?.mint || '',
                      amount: item?.amount || 0,
                    })) || []
                  : listMints
              }
              allMints={data?.common?.all_data || []}
              reset={reset}
              mutate={mutate}
            />
          </div>
          <div>
            <Table
              bottomContent={
                listCarbonPages > 1 ? (
                  <div className="flex w-full justify-center z-[11]">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="success"
                      page={listCarbonPage}
                      total={listCarbonPages}
                      onChange={(page) => setListCarbonPage(page)}
                    />
                  </div>
                ) : null
              }
              checkboxesProps={{
                radius: 'none',
                size: 'sm',
                classNames: {
                  wrapper:
                    'before:border-[#454545] before:border-1 after:bg-primary-color',
                },
              }}
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              aria-label="List Carbon Table"
              shadow="none"
              radius="none"
              classNames={{
                th: 'bg-white h-[56px] border-b-1 border-[#DDE1E6] text-sm text-[#4F4F4F] font-medium',
                td: 'h-[48px] rounded-[4px] group-aria-[selected=false]:group-data-[hover=true]:before:bg-[#EAFFC7] cursor-pointer data-[selected=true]:before:bg-[#EAFFC7]',
                tbody: '[&>*:nth-child(odd)]:bg-[#F6F6F6]',
                wrapper: 'p-0',
              }}
            >
              <TableHeader columns={listCarbonColumns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={'No Carbon found!'}
                items={data?.data || []}
                loadingContent={<DCarbonLoading />}
                loadingState={listCarbonLoadingState}
              >
                {(item) => (
                  <TableRow key={item.mint}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCell(item, columnKey, 'list-carbon')}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Tab>
      </Tabs>
      <BurnModal
        isOpen={isOpen}
        onClose={onClose}
        amount={totalAmountWillBurn}
        onOpen={onOpen}
        router={router}
        mints={
          selectedKeys === 'all'
            ? data?.common?.all_data?.map((item) => ({
                mint: item?.mint || '',
                amount: item?.amount || 0,
              })) || []
            : listMints
        }
        allMints={data?.common?.all_data || []}
        maxAmount={data?.common?.total || 0}
        mutate={mutate}
        reset={reset}
      />
    </>
  );
}

export default CertificateListContent;
