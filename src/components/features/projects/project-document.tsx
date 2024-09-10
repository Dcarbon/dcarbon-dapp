'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { doGetProjectDocuments } from '@/adapters/project';
import DCarbonButton from '@/components/common/button';
import DCarbonLoading from '@/components/common/loading/base-loading';
import { QUERY_KEYS } from '@/utils/constants';
import {
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import useSWR from 'swr';

const rowsPerPage = 10;
const ProjectDocument = () => {
  const [documentPage, setDocumentPage] = useState<number>(1);
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isValidating } = useSWR(
    () =>
      documentPage
        ? [QUERY_KEYS.PROJECTS.GET_PROJECT_DOCUMENTS, documentPage]
        : null,
    ([, page]) => doGetProjectDocuments(slug, page),
    {
      keepPreviousData: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      revalidateOnFocus: true,
    },
  );
  const listDocuments = useMemo(() => {
    return data?.paging?.total
      ? Math.ceil(data?.paging?.total / rowsPerPage)
      : 0;
  }, [data?.paging?.total]);
  const renderCell = (row: any, columnKey: any) => {
    const value = row[columnKey as keyof any];
    switch (columnKey) {
      case 'document_name': {
        return value;
      }
      case 'document_type': {
        return value;
      }
      case 'created_at': {
        return value;
      }
      case 'action':
        return (
          <Link href={row.document_path} download>
            <DCarbonButton color="primary">Download</DCarbonButton>
          </Link>
        );
      default:
        return value;
    }
  };
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
      label: 'Upload time',
    },
    {
      key: 'action',
      label: 'Action',
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
        bottomContent={
          listDocuments > 1 ? (
            <div className="flex w-full justify-center z-[11]">
              <Pagination
                isCompact
                showControls
                showShadow
                color="success"
                page={documentPage}
                total={listDocuments}
                onChange={(page) => setDocumentPage(page)}
              />
            </div>
          ) : null
        }
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
