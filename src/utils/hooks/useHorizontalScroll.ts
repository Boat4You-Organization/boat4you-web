import { useEffect, useRef, useState } from 'react';

interface UseHorizontalScrollOptions {
  scrollOffset?: number;
}

interface UseHorizontalScrollReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isAtStart: boolean;
  isAtEnd: boolean;
  scroll: (direction: 'left' | 'right') => void;
  scrollToElement: (index: number) => void;
  updateArrowsVisibility: () => void;
}

const useHorizontalScroll = (options: UseHorizontalScrollOptions = {}): UseHorizontalScrollReturn => {
  const { scrollOffset = 120 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { clientWidth, scrollLeft } = containerRef.current;
      const offset = clientWidth - scrollOffset;

      containerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - offset : scrollLeft + offset,
        behavior: 'smooth',
      });
    }
  };

  const scrollToElement = (index: number) => {
    if (containerRef.current) {
      const { children } = containerRef.current;

      if (children[index]) {
        const element = children[index] as HTMLElement;
        const container = containerRef.current;

        const containerWidth = container.clientWidth;
        const containerScrollWidth = container.scrollWidth;
        const elementLeft = element.offsetLeft;
        const elementWidth = element.offsetWidth;

        const containerCenter = containerWidth / 2;
        const elementCenter = elementWidth / 2;
        const idealScrollPosition = elementLeft - containerCenter + elementCenter;

        const maxScrollLeft = containerScrollWidth - containerWidth;

        let finalScrollPosition;

        if (idealScrollPosition <= 0) {
          finalScrollPosition = 0;
        } else if (idealScrollPosition >= maxScrollLeft) {
          finalScrollPosition = maxScrollLeft;
        } else {
          finalScrollPosition = idealScrollPosition;
        }

        container.scrollTo({
          left: finalScrollPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const updateArrowsVisibility = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth === scrollWidth);
    }
  };

  useEffect(() => {
    updateArrowsVisibility();
    window.addEventListener('resize', updateArrowsVisibility);

    return () => {
      window.removeEventListener('resize', updateArrowsVisibility);
    };
  }, []);

  return {
    containerRef,
    isAtStart,
    isAtEnd,
    scroll,
    scrollToElement,
    updateArrowsVisibility,
  };
};

export default useHorizontalScroll;
