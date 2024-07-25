'use client';

import React from 'react';
import NextImage from 'next/image';
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
import menuIcon from 'public/images/certificates/menu.svg';

function CertificateListContent() {
  const rows = [
    {
      key: '1',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },
    {
      key: '2',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },
    {
      key: '3',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },
    {
      key: '4',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },

    {
      key: '5',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },
    {
      key: '6',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },
    {
      key: '7',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },
    {
      key: '8',
      date: 'June 26, 2024',
      name: 'Name',
      amount: '$60.000',
    },
  ];

  const columns = [
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
      label: '',
    },
  ];

  const renderCell = React.useCallback((user: any, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof any];

    switch (columnKey) {
      case 'action':
        return (
          <div className="relative flex justify-end">
            <Image
              src={menuIcon.src}
              alt="action"
              as={NextImage}
              width={24}
              height={24}
              draggable={false}
            />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
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
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
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
    </Tabs>
  );
}

export default CertificateListContent;
