
import HeroSection from '@/components/HeroSection';
import OurExpertiseSection from '@/components/OurExpertise';
import HowItWorksSection from '@/components/HowItWorksSection';
import UseCasesSection from '@/components/UseCasesSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <HeroSection />
      <OurExpertiseSection/>
      <HowItWorksSection />
      <UseCasesSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Index;
