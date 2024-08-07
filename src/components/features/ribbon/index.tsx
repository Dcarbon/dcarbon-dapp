'use client';

import React, { memo, useEffect, useState } from 'react';
import { env as envMjs } from 'env.mjs';

function Ribbon() {
  const [env, setEnv] = useState('');

  useEffect(() => {
    const hostname = window.location.hostname;

    switch (hostname) {
      case 'localhost':
        setEnv('LOCAL');
        break;
      default:
        if (envMjs.NEXT_PUBLIC_MODE !== 'prod') {
          setEnv(envMjs.NEXT_PUBLIC_MODE.toUpperCase());
        }
        break;
    }
  }, []);

  return (
    <>
      {env && (
        <div className="fixed left-0 top-0 h-16 w-16 z-50">
          <div className="absolute transform -rotate-45 bg-primary-color text-center  font-bold py-1 left-[-50px] top-[20px] w-[170px] font-sans shadow">
            {env}
          </div>
        </div>
      )}
    </>
  );
}

export default memo(Ribbon);
