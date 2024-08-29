import React from 'react';
import { Metadata } from 'next';
import { doGetProjetList } from '@/adapters/project';
import ProjectContent from '@/components/features/projects/content';
import Sidebar from '@/components/features/projects/sidebar';

import { ProjectStoreProvider } from '../project-store-provider';

function generateMetadata({
  searchParams,
}: {
  searchParams: { mode: string };
}): Metadata {
  switch (searchParams?.mode) {
    case 'quick-buy':
      return {
        title: 'Dcarbon - Quick Buy Carbon Credits | Fast & Easy Transactions',
        description:
          "Use Dcarbon's Quick Buy mode to instantly purchase carbon credits. Enjoy fast, easy transactions on our sustainable marketplace. Start supporting the environment today.",
      };
    default:
      return {
        description:
          'Explore and list carbon credit projects on Dcarbon. Discover verified projects with available credits and contribute to sustainable initiatives. Start your journey today.',
        title:
          'Dcarbon - Browse and List Carbon Credit Projects | Explore Verified Credits',
      };
  }
}
async function Projects({ searchParams }: any) {
  const model = searchParams?.model;
  let iot_model;

  switch (model) {
    case 'G':
      iot_model = 'PrjT_G' as const;
      break;
    case 'E':
      iot_model = 'PrjT_E' as const;
      break;
    default:
      iot_model = undefined;
      break;
  }

  const projectsData = (await doGetProjetList({ iot_model })) as any;
  return (
    <ProjectStoreProvider>
      <main className="px-4 lg:px-[64px] pb-[32px] mt-[90px] lg:mt-[60px] min-h-screen flex gap-[48px]">
        <ProjectContent initialData={projectsData} />
        <Sidebar />
      </main>
    </ProjectStoreProvider>
  );
}

const dynamic = 'force-dynamic';

export { dynamic, generateMetadata };

// eslint-disable-next-line import/no-unused-modules
export default Projects;
