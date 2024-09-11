import React from 'react';
import { Metadata } from 'next';
import CertificateListContent from '@/components/features/profile/list-content';
import CertificateProfile from '@/components/features/profile/profile';

function generateMetadata({
  searchParams,
}: {
  searchParams: { tab: string };
}): Metadata {
  switch (searchParams?.tab) {
    case 'transaction':
      return {
        description:
          'Access and review your transaction history on DCarbon. Track your carbon credit purchases, sales, and activities with ease. Manage your account and stay informed about your sustainability contributions.',
        title:
          'DCarbon - View Your Transaction History | Track Carbon Credit Activity',
      };
    case 'list-carbon':
      return {
        description:
          'View a detailed list of the carbon credits you’ve purchased on DCarbon. Manage your credits and track your environmental contributions easily.',
        title:
          'DCarbon - View Your Purchased Carbon Credits | Track Your Credits',
      };
    default:
      return {
        description:
          'View a complete list of NFTs you’ve minted on DCarbon. Manage and track your carbon credit NFTs, and explore details about each of your minted assets.',
        title:
          'DCarbon - List of Your Minted NFTs | View Your Carbon Credit NFTs',
      };
  }
}
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
export { generateMetadata };
