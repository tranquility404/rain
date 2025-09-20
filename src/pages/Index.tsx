import { useEffect } from 'react';
import ScrollProgress from '@/components/ScrollProgress';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedSection from '@/components/FeaturedSection';
import StatsSection from '@/components/StatsSection';
import ReviewsSection from '@/components/ReviewsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    document.title = 'RAIN - Responsible Aqua Initiative for Nature';
  }, []);

  return (
    <div className="relative">
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <FeaturedSection />
        <StatsSection />
        <ReviewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
