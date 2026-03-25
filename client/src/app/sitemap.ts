import { MetadataRoute } from 'next';

const BASE_URL = 'https://nodegateway.vercel.app'; // Replace with your actual domain later

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/privacy-policy',
    '/refund-policy',
    '/terms',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes];
}