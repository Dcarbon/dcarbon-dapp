'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import { currencyFormatter } from '@/utils/helpers/common';
import {
  Image,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from '@nextui-org/react';
import logo from 'public/images/common/logo.svg';
import solScanIcon from 'public/images/common/sol-scan.avif';
import solanaExplorerIcon from 'public/images/common/solana-explorer.avif';
import viewIcon from 'public/images/common/view-icon.svg';

function CertificateListContent() {
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));

  const certificateRows = [
    {
      key: '1',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '2',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '3',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '4',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },

    {
      key: '5',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '6',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '7',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '8',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
  ];

  const certificateColumns = [
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'name',
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

  const transactionRows = [
    {
      key: '1',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '2',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '3',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60',
    },
    {
      key: '4',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60000',
    },

    {
      key: '5',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60000',
    },
    {
      key: '6',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60000',
    },
    {
      key: '7',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60000',
    },
    {
      key: '8',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '60000',
    },
  ];

  const listCarbonColumns = [
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'amount',
      label: 'List of Dcarbon',
    },

    {
      key: 'action',
      label: 'Action',
    },
  ];

  const renderCell = React.useCallback(
    (user: any, columnKey: React.Key, type?: 'transaction' | 'list-carbon') => {
      const cellValue = user[columnKey as keyof any];

      switch (columnKey) {
        case 'action': {
          if (type === 'transaction' || type === 'list-carbon') {
            return (
              <div className="relative flex gap-4">
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
              </div>
            );
          }
          return (
            <div className="relative flex">
              <Image
                src={viewIcon.src}
                alt="View"
                as={NextImage}
                width={24}
                height={24}
                draggable={false}
              />
            </div>
          );
        }
        case 'amount': {
          if (type === 'transaction') {
            return <span>{currencyFormatter.format(user?.amount || 0)}</span>;
          }

          return (
            <div className="relative flex gap-2 items-center">
              <Image
                src={logo.src}
                alt="DCarbon"
                as={NextImage}
                width={24}
                height={24}
                draggable={false}
              />

              <span>
                {(user?.amount || 0)?.toLocaleString('en-US')} DCarbon
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
    <Tabs
      key="mode"
      variant="light"
      aria-label="Certificate List"
      classNames={{
        tab: 'h-[49px] w-full sm:min-w-[204px]',
        cursor: 'shadow-none bg-[#F6F6F6]',
        tabContent:
          'xl:text-[23px] font-medium group-data-[selected=true]:text-[#21272A]',
        tabList: 'p-0',
        panel: 'pt-[24px] pb-0 w-full',
      }}
      defaultSelectedKey={'certificated'}
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
        >
          <TableHeader columns={certificateColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={certificateRows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Tab>
      <Tab key="transaction" title="Transaction">
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
        >
          <TableHeader columns={certificateColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={transactionRows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey, 'transaction')}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Tab>

      <Tab key="list-carbon" title="List Carbon">
        <div>
          <DCarbonButton color="primary" className="min-w-[150px] h-[34px]">
            Burn
          </DCarbonButton>
        </div>
        <Table
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
            td: 'h-[48px] rounded-[4px]',
            tbody: '[&>*:nth-child(odd)]:bg-[#F6F6F6]',
            wrapper: 'p-0',
          }}
        >
          <TableHeader columns={listCarbonColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={certificateRows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey, 'list-carbon')}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Tab>
    </Tabs>
  );
}

export default CertificateListContent;
