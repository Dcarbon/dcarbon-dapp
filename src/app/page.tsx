import React from 'react';
import lazy from 'next/dynamic';
import { doGetTopPage, IGetTopPageResponse } from '@/adapters/common';

const Hero = lazy(() => import('@/components/features/home/hero'), {
  ssr: false,
});
const Slogan = lazy(() => import('@/components/features/home/slogan'), {
  ssr: false,
});
const Statistics = lazy(() => import('@/components/features/home/statistics'), {
  ssr: false,
});
const ModelS = lazy(() => import('@/components/features/home/model-s'));
const ModelE = lazy(() => import('@/components/features/home/model-e'));
const ModelG = lazy(() => import('@/components/features/home/model-g'));

const Home = async () => {
  const { data } = (await doGetTopPage()) as IGetTopPageResponse;
  return (
    <>
      <main>
        <section className="relative h-screen w-screen overflow-x-hidden">
          <Hero />

          <div className="text-white absolute bottom-[8%] lg:bottom-[4%] 2xl:bottom-[8%] left-0 w-full h-full z-10 flex justify-between max-h-[62vh] lg:max-h-[72vh] 2xl:max-h-[62vh] items-center flex-col gap-4 p-4 overflow-hidden">
            <Slogan />
            {data ? (
              <Statistics
                deployed_nodes_total={data.deployed_nodes_total || 0}
                tco2e_mitigated_total={data.tco2e_mitigated_total || 0}
              />
            ) : null}
          </div>
        </section>

        <ModelE />

        <ModelG />

        <ModelS />
      </main>
    </>
  );
};

const dynamic = 'force-dynamic';

export { dynamic };

// eslint-disable-next-line import/no-unused-modules
export default Home;
