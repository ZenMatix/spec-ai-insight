
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteLoading = () => {
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsRouteLoading(true);
    
    const timer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 500); // Minimum 500ms loading time for page transitions

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return { isRouteLoading };
};
