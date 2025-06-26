
import HeroSection from '@/components/HeroSection';
import OurExpertiseSection from '@/components/OurExpertise';
import HowItWorksSection from '@/components/HowItWorksSection';
import UseCasesSection from '@/components/UseCasesSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import LoadingScreen from '@/components/LoadingScreen';
import { useAppLoading } from '@/hooks/useAppLoading';

const Index = () => {
  const { isLoading } = useAppLoading();

  // Show loading screen with highest priority
  if (isLoading) {
    return <LoadingScreen />;
  }

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
