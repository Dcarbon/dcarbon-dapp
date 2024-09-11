'use client';

import React, { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { doGetProjectDocuments } from '@/adapters/project';
import DCarbonButton from '@/components/common/button';
import DCarbonLoading from '@/components/common/loading/base-loading';
import { QUERY_KEYS } from '@/utils/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import useSWR from 'swr';

const columns = [
  {
    key: 'document_name',
    label: 'Name of Document',
  },
  {
    key: 'document_type',
    label: 'Document Type',
  },
  {
    key: 'created_at',
    label: 'Upload Time',
  },
  {
    key: 'action',
    label: 'Action',
  },
];

const ProjectDocument = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isValidating } = useSWR(
    QUERY_KEYS.PROJECTS.GET_PROJECT_DOCUMENTS,
    () => doGetProjectDocuments(slug),
    {
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );

  const downloadPDF = useCallback(async (pdfUrl: string, fileName?: string) => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }, []);

  const renderCell = useCallback(
    (row: any, columnKey: any) => {
      const value = row[columnKey as keyof any];
      switch (columnKey) {
        case 'document_name': {
          return value;
        }
        case 'document_type': {
          return value;
        }
        case 'created_at': {
          return new Date(value).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        }
        case 'action':
          return (
            <DCarbonButton
              color="primary"
              onClick={() => downloadPDF(row.document_path, row.document_name)}
            >
              Download
            </DCarbonButton>
          );
        default:
          return value;
      }
    },
    [downloadPDF],
  );

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
          th: 'bg-white h-[56px] border-b-1 border-[#DDE1E6] text-sm text-[#4F4F4F] font-medium last:w-[21%]',
          td: 'h-[48px] rounded-[4px] last:w-[21%]',
          tbody: '[&>*:nth-child(odd)]:bg-[#F6F6F6]',
          wrapper: 'p-0',
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent="No Data"
          loadingContent={<DCarbonLoading />}
          loadingState={isLoading || isValidating ? 'loading' : 'idle'}
          items={data?.data || []}
        >
          {(item) => (
            <TableRow key={item.document_id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectDocument;
