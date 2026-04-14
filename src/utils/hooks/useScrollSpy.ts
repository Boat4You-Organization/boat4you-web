import { useEffect, useRef, useState } from 'react';

const useScrollSpy = (sectionIds: string[], offsetPercentage = 0) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    sectionRefs.current = sectionIds.map(sectionId => document.getElementById(sectionId));

    const offset = window.innerHeight * offsetPercentage;

    const handleScroll = () => {
      const sections = sectionRefs.current;
      const top = window.scrollY;

      sections.forEach(section => {
        if (!section) {
          return;
        }

        const offsetTop = section.offsetTop - offset;
        const height = section.offsetHeight;

        if (top >= offsetTop && top < offsetTop + height) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offsetPercentage]);

  return activeSection;
};

export default useScrollSpy;
