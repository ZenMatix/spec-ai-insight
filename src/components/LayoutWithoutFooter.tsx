
import Navigation from '@/components/Navigation';
import ScrollToTop from '@/components/ScrollToTop';
import { Outlet, useLocation } from 'react-router-dom';

const LayoutWithoutFooter = () => {
  const location = useLocation();
  const hideNavigation = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  return (
    <div className="min-h-screen bg-transparent">
      {!hideNavigation && <Navigation />}
      <main>
        <Outlet />
      </main>
      <ScrollToTop />
    </div>
  );
};

export default LayoutWithoutFooter;
