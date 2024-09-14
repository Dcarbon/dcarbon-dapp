'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doGetWoodBurned, GetWoodBurnedRequest } from '@/adapters/project';
import { QUERY_KEYS } from '@/utils/constants';
import useSWRMutation from 'swr/mutation';

import TabContent from './tab-content';

const WoodBurned = () => {
  const params = useParams<{ slug: string }>();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [devices, setDevices] = useState<{}[]>([]);
  const [paging, setPaging] = useState<{
    limit: number;
    page: number;
    total: number;
  } | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const { trigger, isMutating, data } = useSWRMutation(
    [QUERY_KEYS.PROJECTS.GET_CARBON_MINTED_DASHBOARD, params.slug],
    (_, { arg }: { arg: GetWoodBurnedRequest }) => {
      return doGetWoodBurned(params.slug, arg);
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
        if (data?.wood_burned) {
          setChartData(data.wood_burned.data || []);
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
        type: 'wood_burned_data',
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
      model={data?.data?.project_model}
    />
  );
};

export default WoodBurned;
