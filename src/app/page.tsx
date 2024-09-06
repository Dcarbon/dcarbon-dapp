import React from 'react';
import NextImage from 'next/image';
import { doGetTopPage, IGetTopPageResponse } from '@/adapters/common';
import DCarbonButton from '@/components/common/button';
import Hero from '@/components/features/home/hero';
import Slogan from '@/components/features/home/slogan';
import Statistics from '@/components/features/home/statistics';
import { WEB_ROUTES } from '@/utils/constants';
import { Image, Link } from '@nextui-org/react';
import section2Image from 'public/images/home/section-2.avif';
import section3Image from 'public/images/home/section-3.avif';
import section4Image from 'public/images/home/section-4.avif';

const Home = async () => {
  const { data } = (await doGetTopPage()) as IGetTopPageResponse;
  return (
    <>
      <main>
        <section className="relative h-screen w-full">
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

        <section className="relative h-screen w-full">
          <Image
            removeWrapper
            src={section2Image.src}
            alt="Section 2"
            as={NextImage}
            draggable={false}
            radius="none"
            fill
            style={{
              objectFit: 'cover',
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-between items-center flex-col py-[70px]">
            <div className="max-w-[704px] flex flex-col gap-4 items-center">
              <h2 className="text-[44px] font-medium">Model G</h2>
              <p className="text-center font-light">
                Biomass gasification technology converts organic waste into
                syngas for clean energy, featuring continuous feeding, high
                efficiency, and low emissions, reducing fuel costs and
                environmental impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 justify-center items-center">
              <DCarbonButton className="min-w-[200px]">
                <Link
                  className="absolute top-0 left-0 w-full h-full flex justify-center text-sm text-text-primary"
                  href={WEB_ROUTES.PROJECTS + '?mode=quick-buy&model=G'}
                >
                  Order now
                </Link>
              </DCarbonButton>
              <DCarbonButton color="primary" className="min-w-[200px]">
                Learn more
              </DCarbonButton>
            </div>
          </div>
        </section>

        <section className="relative h-screen w-full">
          <Image
            removeWrapper
            src={section3Image.src}
            alt="Section 3"
            as={NextImage}
            draggable={false}
            radius="none"
            fill
            style={{
              objectFit: 'cover',
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-between items-center flex-col py-[70px]">
            <div className="max-w-[704px] flex flex-col gap-4 items-center">
              <h2 className="text-[44px] font-medium">Model E</h2>
              <p className="text-center font-light">
                Biogas to electricity converts organic waste into clean,
                renewable energy, reducing greenhouse gas emissions and
                promoting sustainability.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 justify-center items-center">
              <DCarbonButton className="min-w-[200px]">
                <Link
                  className="absolute top-0 left-0 w-full h-full flex justify-center text-sm text-text-primary"
                  href={WEB_ROUTES.PROJECTS + '?mode=quick-buy&model=E'}
                >
                  Order now
                </Link>
              </DCarbonButton>
              <DCarbonButton color="primary" className="min-w-[200px]">
                Learn more
              </DCarbonButton>
            </div>
          </div>
        </section>

        <section className="relative h-screen w-full">
          <Image
            removeWrapper
            src={section4Image.src}
            alt="Section 4"
            as={NextImage}
            draggable={false}
            radius="none"
            fill
            style={{
              objectFit: 'cover',
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-between items-center flex-col py-[70px]">
            <div className="max-w-[704px] flex flex-col gap-4 items-center">
              <h2 className="text-[44px] font-medium">Model S</h2>
              <p className="text-center font-light">
                Transforms organic waste into biochar, a stable form of carbon
                that not only sequesters carbon dioxide but also enhances soil
                fertility and agricultural productivity.
              </p>
            </div>

            <div>
              <div className="text-white text-[28px] font-light mb-6 text-center">
                Coming soon
              </div>

              <div className="flex flex-wrap gap-8 justify-center items-center">
                <DCarbonButton className="min-w-[200px]" isDisabled>
                  {/* <Link
                    className="absolute top-0 left-0 w-full h-full flex justify-center text-sm text-text-primary"
                    href={WEB_ROUTES.PROJECTS}
                  > */}
                  Order now
                  {/* </Link> */}
                </DCarbonButton>
                <DCarbonButton
                  color="primary"
                  className="min-w-[200px]"
                  isDisabled
                >
                  Learn more
                </DCarbonButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const dynamic = 'force-dynamic';

export { dynamic };

// eslint-disable-next-line import/no-unused-modules
export default Home;
