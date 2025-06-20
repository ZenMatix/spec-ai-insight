
import Navigation from '@/components/Navigation';
import { Outlet } from 'react-router-dom';

const LayoutWithoutFooter = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutWithoutFooter;
