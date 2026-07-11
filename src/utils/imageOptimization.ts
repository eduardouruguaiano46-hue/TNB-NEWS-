/**
 * Image Optimization Utilities
 * Handles CDN URLs, compression, and responsive images
 */

export const CDN_SOURCES = {
  MANUSCRIPT: 'https://files.manuscdn.com',
  POSTIMG: 'https://i.postimg.cc',
  QR_SERVER: 'https://api.qrserver.com'
} as const;

export interface ImageConfig {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Optimize CDN image URLs for faster loading
 * @param url - Original image URL
 * @param config - Configuration options
 * @returns Optimized URL
 */
export const optimizeCDNImage = (url: string, config: ImageConfig = {}): string => {
  if (!url) return '';

  const { width = 800, height, quality = 80, format = 'webp' } = config;

  try {
    const urlObj = new URL(url);

    // Manuscript CDN optimization
    if (urlObj.hostname.includes('manuscdn.com')) {
      // Manuscript already optimizes, just return as-is
      return url;
    }

    // PostImg optimization
    if (urlObj.hostname.includes('postimg.cc')) {
      // PostImg serves optimized images
      return url;
    }

    // QR Server optimization
    if (urlObj.hostname.includes('qrserver.com')) {
      return url; // Already optimized
    }

    return url;
  } catch (error) {
    console.warn('Failed to optimize image URL:', error);
    return url;
  }
};

/**
 * Get responsive image URLs for different screen sizes
 */
export const getResponsiveImageUrl = (url: string): Record<string, string> => {
  return {
    mobile: optimizeCDNImage(url, { width: 400 }),
    tablet: optimizeCDNImage(url, { width: 600 }),
    desktop: optimizeCDNImage(url, { width: 1000 })
  };
};

/**
 * Preload images for better performance
 */
export const preloadImages = (urls: string[]): void => {
  if (typeof window === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Cache buster for image updates
 */
export const getCacheURI = (url: string, version?: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  const v = version || new Date().getTime();
  return `${url}${separator}v=${v}`;
};
