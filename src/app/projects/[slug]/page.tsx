import React from 'react';
import { Metadata } from 'next';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { doGetProjectDetail } from '@/adapters/project';
import Carousel from '@/components/features/projects/carousel';
import DetailSidebar from '@/components/features/projects/detail-sidebar';
import { Image } from '@nextui-org/react';
import locationActiveIcon from 'public/images/common/location-active-icon.svg';

import '@/styles/quill.css';

function generateMetadata(): Metadata {
  return {
    description:
      "View detailed information about carbon credit projects on Dcarbon. Learn about project impacts, available credits, and sustainability benefits. Dive into each project's specifics today.",
    title: 'Dcarbon - Project Details for Carbon Credits | In-Depth Insights',
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

  return (
    <main className="px-4 lg:px-[64px] pb-[32px] mt-[90px] lg:mt-[60px] min-h-screen max-w-[1528px] mx-auto">
      <Carousel data={dataCarousel || []} />
      <div className="flex gap-[24px]">
        <article className="w-full relative">
          <h1 className="text-[23px] font-medium mb-3">
            {data?.data?.project_name || ''}
          </h1>
          <div className="flex items-center gap-2">
            <Image
              src={locationActiveIcon.src}
              alt={location}
              as={NextImage}
              width={20}
              height={20}
              draggable={false}
              className="min-w-[20px]"
            />
            <span className="text-sm">{location}</span>
          </div>
          <div
            id="project-detail-description"
            dangerouslySetInnerHTML={{
              __html: data?.data?.description || '',
            }}
            className="mt-6 text-sm font-light ql-content"
          />
        </article>
        <DetailSidebar data={data} />
      </div>
    </main>
  );
}

export default ProjectDetail;
export { generateMetadata };
