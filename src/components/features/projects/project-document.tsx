'use client';

import React from 'react';
import DCarbonButton from '@/components/common/button';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

const ProjectDocument = () => {
  const renderCell = (row: any, columnKey: any) => {
    const value = row[columnKey as keyof any];
    switch (columnKey) {
      case 'name': {
        return value;
      }
      case 'type': {
        return value;
      }
      case 'date': {
        return value;
      }
      case 'action':
        return <DCarbonButton color="primary">Download</DCarbonButton>;
      default:
        return value;
    }
  };
  const columns = [
    {
      key: 'name',
      label: 'Name of Document',
    },
    {
      key: 'type',
      label: 'Document Type',
    },
    {
      key: 'date',
      label: 'Upload time',
    },
    {
      key: 'action',
      label: 'Action',
    },
  ];
  const rows = [
    {
      key: '1',
      name: 'Document 1',
      type: 'Type 1',
      date: '2022-01-01',
      action: 'Action 1',
    },
  ];
  return (
    <div className="mt-4">
      <div className="border-b-1 border-b-[#E7E7E7] py-[8px]">
        <span className="w-full px-4 py-[10px] text-text-primary border-b-2 border-b-primary-color text-lg font-medium">
          Project Documentation
        </span>
      </div>
      <Table
        aria-label="Example table with dynamic content"
        shadow="none"
        radius="none"
        classNames={{
          base: 'mt-6',
          th: 'bg-white h-[56px] border-b-1 border-[#DDE1E6] text-sm text-[#4F4F4F] font-medium last:w-[20%]',
          td: 'h-[48px] rounded-[4px] last:w-[20%]',
          tbody: '[&>*:nth-child(odd)]:bg-[#F6F6F6]',
          wrapper: 'p-0',
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No Data">
          {rows.map((row) => (
            <TableRow key={row.key}>
              {(columnKey) => (
                <TableCell>{renderCell(row, columnKey)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectDocument;
