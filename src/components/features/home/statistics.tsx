'use client';

import React, { useEffect } from 'react';
import { Divider } from '@nextui-org/react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

type StatisticsProps = {
  deployed_nodes_total: number;
  tco2e_mitigated_total: number;
};
const tranferToK = (value: number) => {
  return (value < 1000 ? value : value / 1000).toLocaleString('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });
};
function Statistics(data: StatisticsProps) {
  const tco2eMintigated = useMotionValue(0);
  const deployedNode = useMotionValue(0);

  const tco2eMintigatedRound = useTransform(tco2eMintigated, (value) =>
    tranferToK(value),
  );
  const deployedNodeRound = useTransform(deployedNode, (value) =>
    tranferToK(value),
  );

  useEffect(() => {
    const tco2eAnimation = animate(
      tco2eMintigated,
      +tranferToK(data.tco2e_mitigated_total),
      {
        duration: 3,
      },
    );

    const deployedNodeAnimation = animate(
      deployedNode,
      +tranferToK(data.deployed_nodes_total),
      {
        duration: 3,
      },
    );

    return () => {
      tco2eAnimation.stop();
      deployedNodeAnimation.stop();
    };
  }, [
    data.deployed_nodes_total,
    data.tco2e_mitigated_total,
    tco2eMintigated,
    deployedNode,
  ]);

  return (
    <div className="p-6 backdrop-blur-sm rounded-[16px] flex items-center space-x-[25.75px]">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-primary-color text-xl sm:text-5xl font-bold">
          <motion.span>{deployedNodeRound}</motion.span>
          <span>{data.deployed_nodes_total < 1000 ? '' : 'k'}</span>
        </span>
        <span>Deployed Nodes</span>
      </div>
      <Divider orientation="vertical" className="w-[1.5px] bg-white/40" />
      <div className="flex flex-col gap-2 items-center">
        <span className="text-primary-color text-xl sm:text-5xl font-bold">
          <motion.span>{tco2eMintigatedRound}</motion.span>
          <span>{data.tco2e_mitigated_total < 1000 ? '' : 'K'}</span>
        </span>
        <span>tCO2e Mitigated</span>
      </div>
    </div>
  );
}

export default Statistics;
