import React from 'react';
import { Spinner } from '@nextui-org/react';

function DCarbonLoading() {
  return (
    <div className="backdrop-blur-[1px] w-full h-full flex justify-center items-center z-10">
      <Spinner color="success" />
    </div>
  );
}

export default DCarbonLoading;
