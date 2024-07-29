import { createStore } from 'zustand/vanilla';

type GlobalState = {
  theme: 'dark' | 'light';
};

type GlobalActions = {
  setTheme: (theme: 'dark' | 'light') => void;
};

type GlobalStore = GlobalState & GlobalActions;

const defaultInitState: GlobalState = {
  theme: 'light',
};

const createGlobalStore = (initState: GlobalState = defaultInitState) => {
  return createStore<GlobalStore>()((set) => ({
    ...initState,
    setTheme: (theme: 'light' | 'dark') => {
      const body = document.body;

      if (theme === 'dark') {
        if (!body.hasAttribute('theme-mode')) {
          body.setAttribute('theme-mode', 'dark');
        }
      } else {
        if (body.hasAttribute('theme-mode')) {
          body.removeAttribute('theme-mode');
        }
      }
      return set({ theme });
    },
  }));
};

export { createGlobalStore };

export type { GlobalStore };
