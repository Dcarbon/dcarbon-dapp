import React from 'react';
import NextImage from 'next/image';
import DCarbonButton from '@/components/common/button';
import CertificateListContent from '@/components/features/profile/list-content';
import CertificateProfile from '@/components/features/profile/profile';
import { Avatar, Image } from '@nextui-org/react';
import avatar from 'public/images/certificates/avatar.png';
import cameraIcon from 'public/images/certificates/camera.svg';
import editIcon from 'public/images/certificates/edit.svg';

async function CertificatesPage() {
  return (
    <>
      <main className="px-4 lg:px-[64px] pb-[32px] mt-[90px] lg:mt-[60px] min-h-screen flex gap-[48px] bg-[url('/images/certificates/cover.avif')] bg-no-repeat bg-fixed bg-[length:1920px_291px] bg-[#F6F6F6]">
        <div className="mt-[48px] flex gap-12 items-start w-full flex-col lg:flex-row">
          <div className="pt-[46px] px-[32px] pb-[41px] bg-white rounded-lg w-full lg:max-w-[408px] flex flex-col items-center gap-8">
            <div className="flex flex-col items-center">
              <div className="relative">
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

                <div className="w-12 h-12 rounded-full bg-white shadow-[2px_4px_8px_0px_#0000001A] flex justify-center items-center absolute right-0 bottom-0">
                  <Image
                    src={cameraIcon.src}
                    alt="upload avatar"
                    as={NextImage}
                    width={24}
                    height={24}
                    draggable={false}
                    radius="none"
                  />
                </div>
              </div>

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

          <div className="bg-white w-full p-4 rounded-lg">
            <CertificateListContent />
          </div>
        </div>
      </main>
    </>
  );
}

export default CertificatesPage;
