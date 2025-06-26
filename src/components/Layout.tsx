
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';
import { useAppLoading } from '@/hooks/useAppLoading';

const Layout = () => {
  const { isLoading } = useAppLoading();

  // Don't render the layout content while loading
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
