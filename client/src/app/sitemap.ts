import { MetadataRoute } from 'next';

const BASE_URL = 'https://nodegateway.vercel.app'; // Replace with your actual domain later

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/features', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/blog/how-payment-gateways-work', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/blog/nodejs-payment-integration-guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/refund-policy', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
  ];

  const routes = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
    priority,
  }));

  return routes;
}