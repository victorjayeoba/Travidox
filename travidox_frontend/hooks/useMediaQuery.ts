import { useState, useEffect } from 'react';

/**
 * Custom hook that returns whether a media query matches or not
 * @param query The media query to match against (e.g. '(max-width: 640px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      // Create media query list and check initial match
      const mediaQuery = window.matchMedia(query);
      setMatches(mediaQuery.matches);

      // Define listener function
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add listener for changes
      mediaQuery.addEventListener('change', handleChange);

      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [query]);

  return matches;
} 