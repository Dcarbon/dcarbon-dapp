import { createStore } from 'zustand/vanilla';

type ProjectState = {
  keyword?: string;
  filters?: {
    country?: { label: string; value: string };
    location?: string;
    quantity?: '40_90' | '90_200' | '200' | '1_20' | '20_100' | '100';
  };
  isLoading?: boolean;
  action?: 'search' | 'filter';
};

type ProjectAction = {
  setKeyword: (kw?: string) => void;
  setFilters: (filters?: {
    country?: { label: string; value: string };
    location?: string;
    quantity?: '40_90' | '90_200' | '200' | '1_20' | '20_100' | '100';
  }) => void;
  setLoading: (loading: boolean) => void;
  setAction: (action: 'search' | 'filter') => void;
};

type ProjectStore = ProjectState & ProjectAction;

const defaultInitState: ProjectState = {
  keyword: '',
  filters: undefined,
};

const createProjectStore = (initState: ProjectState = defaultInitState) => {
  return createStore<ProjectStore>()((set) => ({
    ...initState,
    setKeyword: (kw?: string) => set(() => ({ keyword: kw })),
    setFilters: (filters?: {
      country?: { label: string; value: string };
      location?: string;
      quantity?: '40_90' | '90_200' | '200' | '1_20' | '20_100' | '100';
    }) => set(() => ({ filters })),
    setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
    setAction: (action: 'search' | 'filter') => set(() => ({ action })),
  }));
};

export { createProjectStore };

export type { ProjectStore };
