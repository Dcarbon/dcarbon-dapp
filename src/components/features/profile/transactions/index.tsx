import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/react';

import BurnTransactions from './burn-transactions';
import CarbonTransaction from './carbon-transactions';

type tabTypes = 'carbon' | 'burn';

const Transactions = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<tabTypes>(
    (searchParams.get('type') as tabTypes) || 'carbon',
  );
  useEffect(() => {
    setSelectedTab((prev) => {
      if (prev !== searchParams.get('type')) {
        return (searchParams.get('type') as tabTypes) || 'carbon';
      }
      return prev;
    });
  }, [searchParams]);
  const handleChangeTab = useCallback(
    (tab: tabTypes) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('type', tab);

      const newParams = params.toString();
      setSelectedTab(tab);
      router.push(pathname + '?' + newParams, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  return (
    <Tabs
      key="mode"
      variant="underlined"
      aria-label="transaction"
      classNames={{
        base: 'flex',
        tab: 'h-[40px] w-full sm:min-w-[204px] data-[focus-visible=true]:outline-0',
        cursor: 'shadow-none bg-primary-color',
        tabContent:
          'xl:text-[18px] font-medium group-data-[selected=true]:text-primary-color',
        tabList: 'p-0',
        panel: 'pb-0 w-full',
      }}
      selectedKey={selectedTab}
      onSelectionChange={(tab) => handleChangeTab(tab as tabTypes)}
    >
      <Tab key="carbon" title="Carbon Transaction">
        <CarbonTransaction />
      </Tab>
      <Tab key="burn" title="Transaction Burn">
        <BurnTransactions />
      </Tab>
    </Tabs>
  );
};

export default Transactions;
