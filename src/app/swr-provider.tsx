'use client';

import React from 'react';
import { SWRConfig } from 'swr';

function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        revalidateOnMount: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}

export default SWRProvider;
