'use client';

import React, { useEffect } from 'react';
import { Divider } from '@nextui-org/react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

function Statistics() {
  const projectCount = useMotionValue(0);
  const organizationCount = useMotionValue(0);
  const userCount = useMotionValue(0);
  const projectRound = useTransform(projectCount, Math.round);
  const organizationRound = useTransform(organizationCount, Math.round);
  const userRound = useTransform(userCount, Math.round);

  useEffect(() => {
    const animation = animate(projectCount, 30, { duration: 3 });
    const organizationAnimation = animate(organizationCount, 26, {
      duration: 3,
    });

    const userAnimation = animate(userCount, 1690, { duration: 3 });

    return () => {
      animation.stop();
      organizationAnimation.stop();
      userAnimation.stop();
    };
  }, []);

  return (
    <div className="p-6 backdrop-blur-sm rounded-[16px] flex items-center space-x-[25.75px]">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-primary-color text-xl sm:text-5xl font-bold">
          <motion.span>{projectRound}</motion.span>
          <span>K</span>
        </span>
        <span>Project</span>
      </div>
      <Divider orientation="vertical" className="w-[1.5px] bg-white/40" />
      <div className="flex flex-col gap-2 items-center">
        <span className="text-primary-color text-xl sm:text-5xl font-bold">
          <motion.span>{organizationRound}</motion.span>
          <span>K</span>
        </span>
        <span>Organization</span>
      </div>
      <Divider orientation="vertical" className="w-[1.5px] bg-white/40" />
      <div className="flex flex-col gap-2 items-center">
        <span className="text-primary-color text-xl sm:text-5xl font-bold">
          <motion.span>{userRound}</motion.span>
          <span>K</span>
        </span>
        <span>User</span>
      </div>
    </div>
  );
}

export default Statistics;
