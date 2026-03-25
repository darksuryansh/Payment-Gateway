import { MetadataRoute } from 'next';

const BASE_URL = 'https://nodegateway.vercel.app'; // Replace with your actual domain later

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}