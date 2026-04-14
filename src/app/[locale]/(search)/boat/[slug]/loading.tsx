'use client';

import Layout from '@/components/Layout';
import BoatContentSection from '@/components/Loaders/SingleBoatPageLoader/BoatContentSection';
import BoatHeroSection from '@/components/Loaders/SingleBoatPageLoader/BoatHeroSection';
import useScrollToTop from '@/utils/hooks/useScrollToTop';

const SingleBoatLoader = () => {
  useScrollToTop();

  return (
    <Layout isBoat>
      <BoatHeroSection />
      <BoatContentSection />
    </Layout>
  );
};

export default SingleBoatLoader;
