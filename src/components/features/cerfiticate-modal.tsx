'use client';

import React from 'react';
import { Tab, Tabs, useDisclosure } from '@nextui-org/react';
import cerfiticateIcon from 'public/images/projects/cerfiticate-icon.png';

import DCarbonButton from '../common/button';
import DCarbonModal from '../common/modal';
import CerfiticateCorporate from './cerfiticate-corporate';
import CerfiticateIndividual from './cerfiticate-individual';

function CerfiticateModal() {
  const { onClose } = useDisclosure();
  return (
    <DCarbonModal
      onClose={onClose}
      isOpen
      title="Ceritificate Info"
      icon={cerfiticateIcon.src}
      cancelBtn={
        <DCarbonButton fullWidth className="bg-[#F6F6F6]">
          Back
        </DCarbonButton>
      }
      okBtn={
        <DCarbonButton color="primary" fullWidth>
          Create
        </DCarbonButton>
      }
      hideCloseButton
      centeredTitle
      classNames={{
        title: 'text-[23px] font-semibold',
      }}
    >
      <div className="flex flex-col gap-2 items-center mb-2">
        <Tabs
          key="mode"
          variant="light"
          aria-label="Projects Mode"
          classNames={{
            tab: 'h-[49px]',
            cursor: 'shadow-none bg-[#F6F6F6]',
            tabContent:
              'xl:text-[23px] font-medium group-data-[selected=true]:text-[#21272A]',
            tabList: 'p-0',
            panel: 'pt-[16px] pb-0 w-full',
          }}
          fullWidth
          defaultSelectedKey={'individual'}
        >
          <Tab key="individual" title="Individual">
            <CerfiticateIndividual />
          </Tab>
          <Tab key="corporate" title="Corporate">
            <CerfiticateCorporate />
          </Tab>
        </Tabs>
      </div>
    </DCarbonModal>
  );
}

export default CerfiticateModal;
