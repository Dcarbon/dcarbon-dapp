import React from 'react';
import CertificateListContent from '@/components/features/profile/list-content';
import CertificateProfile from '@/components/features/profile/profile';

async function CertificatesPage() {
  return (
    <>
      <main className="px-4 lg:px-[64px] pb-[32px] mt-[90px] lg:mt-[60px] min-h-screen flex gap-[48px] bg-[url('/images/certificates/cover.avif')] bg-no-repeat bg-fixed bg-[length:1920px_291px] bg-[#F6F6F6]">
        <div className="mt-[48px] flex gap-12 items-start w-full flex-col lg:flex-row">
          <CertificateProfile />
          <div className="bg-white w-full p-4 rounded-lg">
            <CertificateListContent />
          </div>
        </div>
      </main>
    </>
  );
}

export default CertificatesPage;
