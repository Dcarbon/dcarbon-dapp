import dynamic from 'next/dynamic';

const Pdf = dynamic(() => import('./test'), { ssr: false });

function Pdff() {
  return <Pdf />;
}

export default Pdff;
