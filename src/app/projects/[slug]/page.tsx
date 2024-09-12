import React from 'react';
import { Metadata } from 'next';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { doGetProjectDetail } from '@/adapters/project';
import Carousel from '@/components/features/projects/carousel';
import DetailSidebar from '@/components/features/projects/detail-sidebar';
import { Image } from '@nextui-org/react';
import locationActiveIcon from 'public/images/common/location-active-icon.svg';
import dateIcon from 'public/images/projects/date.svg';
import keyIcon from 'public/images/projects/key.svg';
import typeIcon from 'public/images/projects/project-type.svg';

import '@/styles/quill.css';

import ProjectDetailTabs from '@/components/features/projects/project-detail-tabs';
import ProjectDocument from '@/components/features/projects/project-document';

function generateMetadata(): Metadata {
  return {
    description:
      "View detailed information about carbon credit projects on DCarbon. Learn about project impacts, available credits, and sustainability benefits. Dive into each project's specifics today.",
    title: 'DCarbon - Project Details for Carbon Credits | In-Depth Insights',
  };
}
async function ProjectDetail({ params }: { params: { slug: string } }) {
  const data = (await doGetProjectDetail(params.slug)) as any;
  if (data.statusCode !== 200) {
    return notFound();
  }
  let dataCarousel: string[] = [];

  if (data?.data?.images?.length > 2 && data?.data?.images?.length < 5) {
    dataCarousel = [
      ...(data?.data?.images || []),
      ...(data?.data?.images || []),
    ];
  } else {
    dataCarousel = data?.data?.images;
  }
  const location = `${data?.data?.location?.name || ''}${data?.data?.country_name ? `, ${data?.data?.country_name}` : ''}`;
  const key = data?.data?.po_wallet || '';
  const type = data?.data?.type?.name || '';
  const date = data?.data?.implementation_date
    ? new Date(data.data.implementation_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      })
    : '';
  return (
    <main className="px-4 lg:px-[64px] pb-[32px] mt-[90px] lg:mt-[60px] min-h-screen max-w-[1528px] mx-auto">
      <Carousel data={dataCarousel || []} />
      <div className="flex gap-[24px]">
        <article className="w-full relative">
          <h1 className="text-[23px] font-medium mb-3">
            {data?.data?.project_name || ''}
          </h1>
          <div className="flex flex-wrap items-start *:flex-auto *:min-w-[50%] *:xl:w-[50%]  gap-y-4">
            <div className="flex items-start gap-2">
              <span className="flex items-center flex-nowrap gap-2">
                <Image
                  src={locationActiveIcon.src}
                  alt={location}
                  as={NextImage}
                  width={20}
                  height={20}
                  draggable={false}
                  className="min-w-[20px]"
                />
                <span className="text-sm text-[#4f4f4f]">Location:</span>
              </span>
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex items-center flex-nowrap gap-2">
                <Image
                  src={typeIcon.src}
                  alt={'project type'}
                  as={NextImage}
                  width={20}
                  height={20}
                  radius="none"
                  draggable={false}
                  className="min-w-[20px]"
                />
                <span className="text-sm text-[#4f4f4f]">Project type:</span>
              </span>
              <span className="text-sm">{type}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex items-center flex-nowrap gap-2">
                <Image
                  src={dateIcon.src}
                  alt={'implementation date'}
                  as={NextImage}
                  width={20}
                  height={20}
                  radius="none"
                  draggable={false}
                  className="min-w-[20px]"
                />
                <span className="text-sm text-[#4f4f4f]">
                  Implementation date:
                </span>
              </span>
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex items-center flex-nowrap gap-2">
                <Image
                  src={keyIcon.src}
                  alt={'project key'}
                  as={NextImage}
                  width={20}
                  height={20}
                  draggable={false}
                  radius="none"
                  className="min-w-[20px]"
                />
                <span className="text-sm text-[#4f4f4f]">Key:</span>
              </span>
              <span className="text-sm overflow-hidden text-ellipsis whitespace-pre-wrap break-words">
                {key}
              </span>
            </div>
          </div>
          <div
            id="project-detail-description"
            dangerouslySetInnerHTML={{
              __html: data?.data?.description || '',
            }}
            className="mt-6 text-sm font-light ql-content xl:max-h-[855px]"
          />
        </article>
        <DetailSidebar data={data} />
      </div>
      <ProjectDetailTabs type={data?.data?.iot_models[0]?.id || ''} />
      <ProjectDocument />
    </main>
  );
}

export default ProjectDetail;
export { generateMetadata };
