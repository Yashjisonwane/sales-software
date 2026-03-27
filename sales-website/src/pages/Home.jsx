import { useEffect, useRef } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCarousel from '../components/FeatureCarousel';
import VideoSection from '../components/VideoSection';
import TestimonialsSection from '../components/TestimonialsSection';
import DownloadSection from '../components/DownloadSection';
import PricingSection from '../components/PricingSection';

const Home = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      <HeroSection />

      <div className="scroll-animate">
        <FeatureCarousel />
      </div>

      <div className="scroll-animate">
        <PricingSection />
      </div>

      <div className="scroll-animate">
        <VideoSection />
      </div>

      <div className="scroll-animate">
        <TestimonialsSection />
      </div>

      <div className="scroll-animate">
        <DownloadSection />
      </div>
    </div>
  );
};

export default Home;
