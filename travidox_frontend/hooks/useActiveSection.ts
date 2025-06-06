import { useState, useEffect } from 'react';

interface UseActiveSectionOptions {
  sectionIds: string[];
  offset?: number;
}

export function useActiveSection({ sectionIds, offset = 100 }: UseActiveSectionOptions) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      
      // Check if we're at the top of the page (above the first section)
      if (window.scrollY < 100) {
        setActiveSection(null);
        return;
      }
      
      // Find the section that is currently in view
      let currentSection = null;
      
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = sectionId;
          break;
        }
      }
      
      setActiveSection(currentSection);
    };
    
    // Initial check
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offset]);
  
  return activeSection;
} 