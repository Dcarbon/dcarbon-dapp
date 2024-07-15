'use client';

import { createContext, ReactNode, useContext, useRef } from 'react';
import { createProjectStore, ProjectStore } from '@/stores/project.store';
import { useStore } from 'zustand';

type ProjectStoreApi = ReturnType<typeof createProjectStore>;

const ProjectStoreContext = createContext<ProjectStoreApi | undefined>(
  undefined,
);

interface ProjectStoreProviderProps {
  children: ReactNode;
}

const ProjectStoreProvider = ({ children }: ProjectStoreProviderProps) => {
  const storeRef = useRef<ProjectStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createProjectStore();
  }

  return (
    <ProjectStoreContext.Provider value={storeRef.current}>
      {children}
    </ProjectStoreContext.Provider>
  );
};

const useProjectStore = <T,>(selector: (store: ProjectStore) => T): T => {
  const counterStoreContext = useContext(ProjectStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useProjectStore must be used within ProjectStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

export { useProjectStore, ProjectStoreProvider };
