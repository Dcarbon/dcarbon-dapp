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
  }, []);
  return (
    <Tabs
      key="mode"
      variant="underlined"
      destroyInactiveTabPanel
      aria-label="transaction"
      classNames={{
        base: "flex mt-12  relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-[100%] before:h-[1px] before:bg-[#E7E7E7]",
        tab: 'h-[40px] w-full sm:min-w-[204px] data-[focus-visible=true]:outline-0 *:w-full',
        cursor: 'shadow-none bg-primary-color',
        tabContent:
          'xl:text-[18px] font-medium group-data-[selected=true]:text-text-primary text-[#888888]',
        tabList: 'p-0',
        panel: 'pb-0 w-full py-8',
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
