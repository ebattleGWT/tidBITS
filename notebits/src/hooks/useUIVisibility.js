import { useState, useCallback, useEffect, useRef } from 'react';

function useUIVisibility() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const lastScrollTop = useRef(0);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleScroll = useCallback((scrollTop) => {
    if (scrollTop > lastScrollTop.current && scrollTop > 50) {
      setIsSearchVisible(false);
    } else if (scrollTop < lastScrollTop.current) {
      setIsSearchVisible(true);
    }
    lastScrollTop.current = scrollTop;
  }, []);

  useEffect(() => {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      searchContainer.style.transform = isSidebarOpen ? 'translateY(-100%)' : 'translateY(0)';
    }
  }, [isSidebarOpen]);

  return {
    isSidebarOpen,
    isSearchVisible,
    toggleSidebar,
    closeSidebar,
    handleScroll
  };
}

export default useUIVisibility;
