import React from 'react';
import { doGetProjetList } from '@/adapters/project';
import ProjectContent from '@/components/features/projects/content';
import Sidebar from '@/components/features/projects/sidebar';

import { ProjectStoreProvider } from '../project-store-provider';

async function Projects() {
  const projectsData = (await doGetProjetList()) as any;

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

export { dynamic };

// eslint-disable-next-line import/no-unused-modules
export default Projects;
