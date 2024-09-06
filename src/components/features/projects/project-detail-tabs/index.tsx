'use client';

import React, { useCallback, useState } from 'react';

import { Tab, Tabs } from '@nextui-org/react';
import CarbonMinted from './carbon-minted';
import WoodBurned from './wood-burned';

type tabTypes = 'carbon' | 'wood';

const ProjectDetailTabs = () => {
  const [selectedTab, setSelectedTab] = useState<tabTypes>(
    'carbon' as tabTypes,
  );

  const handleChangeTab = useCallback((tab: tabTypes) => {
    setSelectedTab(tab);
  }, [selectedTab]);
  return (
    <Tabs
      key="mode"
      variant="underlined"
      destroyInactiveTabPanel
      aria-label="transaction"
      classNames={{
        base: "flex mt-12  relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-[100vw] before:h-[2px] before:bg-[#E7E7E7]",
        tab: 'h-[40px] w-full sm:min-w-[204px] data-[focus-visible=true]:outline-0',
        cursor: 'shadow-none bg-primary-color',
        tabContent:
          'xl:text-[18px] font-medium group-data-[selected=true]:text-primary-color',
        tabList: "p-0",
        panel: 'pb-0 w-full',
      }}
      selectedKey={selectedTab}
      onSelectionChange={(tab) => handleChangeTab(tab as tabTypes)}
    >
      <Tab key="carbon" title="Carbon minted">
        <CarbonMinted />
      </Tab>
      <Tab key="burn" title="Wood burned">
        <WoodBurned />
      </Tab>
    </Tabs>
  );
};

export default ProjectDetailTabs;
