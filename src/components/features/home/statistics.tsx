'use client';

import React, { useEffect } from 'react';
import { Divider } from '@nextui-org/react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

type StatisticsProps = {
  deployed_nodes_total: number;
  tco2e_mitigated_total: number;
};
function Statistics(data: StatisticsProps) {
  const projectCount = useMotionValue(0);
  const organizationCount = useMotionValue(0);
  const userCount = useMotionValue(0);

  const organizationRound = useTransform(organizationCount, (value) =>
    Math.round(value).toLocaleString('en-US'),
  );
  const userRound = useTransform(userCount, (value) =>
    Math.round(value).toLocaleString('en-US'),
  );

  useEffect(() => {
    const organizationAnimation = animate(
      organizationCount,
      data.deployed_nodes_total,
      {
        duration: 3,
      },
    );

    const userAnimation = animate(userCount, data.tco2e_mitigated_total, {
      duration: 3,
    });

    return () => {
      organizationAnimation.stop();
      userAnimation.stop();
    };
  }, [
    data.deployed_nodes_total,
    data.tco2e_mitigated_total,
    organizationCount,
    projectCount,
    userCount,
  ]);

  return (
    <div className="p-6 backdrop-blur-sm rounded-[16px] flex items-center space-x-[25.75px]">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-primary-color text-xl sm:text-5xl font-bold">
          <motion.span>{organizationRound}</motion.span>
          <span>K</span>
        </span>
        <span>tCO2e Mitigated</span>
      </div>
      <Divider orientation="vertical" className="w-[1.5px] bg-white/40" />
      <div className="flex flex-col gap-2 items-center">
        <span className="text-primary-color text-xl sm:text-5xl font-bold">
          <motion.span>{userRound}</motion.span>
          <span>K</span>
        </span>
        <span>Deployed Nodes</span>
      </div>
    </div>
  );
}

export default Statistics;
