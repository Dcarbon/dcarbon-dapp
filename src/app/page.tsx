import React from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import { WEB_ROUTES } from '@/utils/constants';
import { Divider, Image, Link } from '@nextui-org/react';
import arrowRightButtonImage from 'public/images/home/arrow-right-button.svg';
import heroImage from 'public/images/home/hero.avif';
import section2Image from 'public/images/home/section-2.avif';
import section3Image from 'public/images/home/section-3.avif';
import section4Image from 'public/images/home/section-4.avif';

const Home = async () => {
  return (
    <>
      <main>
        <section className="relative h-screen w-full">
          <Image
            removeWrapper
            src={heroImage.src}
            alt="Hero"
            as={NextImage}
            draggable={false}
            radius="none"
            fill
            style={{
              objectFit: 'cover',
            }}
            priority
          />
          <div className="text-white absolute bottom-[8%] left-0 w-full h-full z-10 flex justify-between max-h-[62vh] items-center flex-col gap-4 p-4 overflow-hidden">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-5xl font-semibold text-center">
                <span className="text-primary-color">DCarbon</span> a Trustless
                and <br /> autonomous Carbon system
              </h2>

              <p className="text-[#d9d9d9] text-center">
                Accurately measure, report and verify carbon footprints reduced,
                then <br /> bring them to the blockchains.
              </p>

              <div className="flex">
                <DCarbonButton
                  color="primary"
                  className="mt-[11px] h-[53px] mx-auto"
                  endContent={
                    <Image
                      src={arrowRightButtonImage.src}
                      width={20}
                      height={20}
                      as={NextImage}
                      alt="Arrow Right"
                      radius="none"
                      draggable={false}
                    />
                  }
                >
                  Get in touch
                </DCarbonButton>
              </div>
            </div>

            <div className="p-6 backdrop-blur-sm rounded-[16px] flex items-center space-x-[25.75px]">
              <div className="flex flex-col gap-2 items-center">
                <span className="text-primary-color text-xl sm:text-5xl font-bold">
                  30K
                </span>
                <span>Project</span>
              </div>
              <Divider
                orientation="vertical"
                className="w-[1.5px] bg-white/40"
              />
              <div className="flex flex-col gap-2 items-center">
                <span className="text-primary-color text-xl sm:text-5xl font-bold">
                  26K
                </span>
                <span>Organization</span>
              </div>
              <Divider
                orientation="vertical"
                className="w-[1.5px] bg-white/40"
              />
              <div className="flex flex-col gap-2 items-center">
                <span className="text-primary-color text-xl sm:text-5xl font-bold">
                  1.690K
                </span>
                <span>User</span>
              </div>
            </div>
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
                Lorem ipsum dolor sit amet consectetur. Vestibulum vitae morbi
                magna urna mollis sit malesuada. Praesent nunc consequat
                convallis.
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
