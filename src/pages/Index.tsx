import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProjectProgressSection from '@/components/ProjectProgressSection';
import ScrollProgress from '@/components/ScrollProgress';
import StatsSection from '@/components/StatsSection';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    document.title = 'RAIN Platform - Empowering India\'s Water Independence';
  }, []);

  return (
    <div className="relative">
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <ProjectProgressSection />
        {/* <FeaturedSection /> */}
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
