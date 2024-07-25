import React from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import CertificateProfile from '@/components/features/certificates/profile';
import { Avatar, Image } from '@nextui-org/react';
import avatar from 'public/images/certificates/avatar.png';
import editIcon from 'public/images/certificates/edit.svg';

function CertificatesPage() {
  return (
    <>
      <main className="px-4 lg:px-[64px] pb-[32px] mt-[90px] lg:mt-[60px] min-h-screen flex gap-[48px] bg-[url('/images/certificates/cover.avif')] bg-no-repeat bg-fixed bg-[length:1920px_291px] bg-[#F6F6F6]">
        <div className="mt-[48px]">
          <div className="pt-[46px] px-[32px] pb-[41px] bg-white rounded-lg min-w-[408px] flex flex-col items-center gap-8">
            <div className="flex flex-col items-center">
              <Avatar
                isBordered
                src={avatar.src}
                ImgComponent={NextImage}
                imgProps={{
                  width: 160,
                  height: 160,
                  draggable: false,
                  alt: 'Avatar',
                }}
                classNames={{
                  base: 'w-[166px] h-[166px] ring-primary-color',
                }}
              />

              <h1 className="text-lg font-medium mt-4">Unnamed</h1>
              <CertificateProfile />
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="p-4 bg-[#F6F6F6] w-full flex gap-6 justify-between h-[52px] rounded-lg items-center">
                <div className="font-light">Funded</div>
                <div className="font-medium">100 USDC</div>
              </div>

              <div className="p-4 bg-[#F6F6F6] w-full flex gap-6 justify-between h-[52px] rounded-lg items-center">
                <div className="font-light">Offset</div>
                <div className="font-medium">100 USDC</div>
              </div>
            </div>

            <DCarbonButton
              color="primary"
              fullWidth
              startContent={
                <Image
                  src={editIcon.src}
                  alt="edit"
                  as={NextImage}
                  width={20}
                  height={20}
                  radius="none"
                />
              }
            >
              Edit Profile
            </DCarbonButton>
          </div>
        </div>
      </main>
    </>
  );
}

export default CertificatesPage;
