'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doGetCarbonMinted, GetCarbonMintedRequest } from '@/adapters/project';
import { QUERY_KEYS } from '@/utils/constants';
import useSWRMutation from 'swr/mutation';

import TabContent from './tab-content';

const CarbonMinted = () => {
  const params = useParams<{ slug: string }>();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [devices, setDevices] = useState<{}[]>([]);
  const [paging, setPaging] = useState<{
    limit: number;
    page: number;
    total: number;
  } | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const { trigger, isMutating } = useSWRMutation(
    [QUERY_KEYS.PROJECTS.GET_CARBON_MINTED_DASHBOARD, params.slug],
    (_, { arg }: { arg: GetCarbonMintedRequest }) => {
      return doGetCarbonMinted(params.slug, arg);
    },
    {
      onSuccess: ({ data }) => {
        if (data?.device_info?.devices) {
          setDevices([...devices, ...data.device_info.devices]);
          data.device_info.devices.forEach((device: any) => {
            if (device.is_selected) {
              setSelectedDevice(device.device_id);
            }
          });
          setPaging(data.device_info.paging);
        }
        if (data?.carbon_minted) {
          setChartData(data.carbon_minted.data || []);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
  useEffect(() => {
    trigger({
      type: 'all_data',
      devices_limit: 5,
      devices_page: 1,
    });
  }, [trigger]);
  const handleSelectDevice = useCallback(
    (device_id: string) => {
      setSelectedDevice(device_id);
      trigger({
        type: 'minted_data',
        device_id,
      });
    },
    [trigger],
  );
  return (
    <TabContent
      chartData={chartData}
      devices={devices}
      selectedDevice={selectedDevice}
      isMutating={isMutating}
      paging={paging}
      handleSelectDevice={handleSelectDevice}
      trigger={trigger}
    />
  );
};

export default CarbonMinted;
