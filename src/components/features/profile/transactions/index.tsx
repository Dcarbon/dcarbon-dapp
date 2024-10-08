'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/react';

import BurnTransactions from './burn-transactions';
import BuyTransaction from './buy-transactions';

type tabTypes = 'buy' | 'burn';

const Transactions = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<tabTypes>(
    searchParams.get('type') as tabTypes,
  );
  useEffect(() => {
    setSelectedTab((prev) => {
      if (
        prev !== searchParams.get('type') &&
        searchParams.get('tab') === 'transaction'
      ) {
        return searchParams.get('type') as tabTypes;
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
      destroyInactiveTabPanel
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
      <Tab key="buy" title="Buy Transaction">
        <BuyTransaction />
      </Tab>
      <Tab key="burn" title="Burn Transaction">
        <BurnTransactions />
      </Tab>
    </Tabs>
  );
};

export default Transactions;
