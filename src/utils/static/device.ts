// Server-side: pass userAgent as argument
export function isMobileUserAgent(userAgent: string | null) {
  return !!userAgent && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// Client-side: call getIsMobileClient()
export function getIsMobileClient() {
  if (typeof window === 'undefined') return false;

  return isMobileUserAgent(window.navigator.userAgent);
}
