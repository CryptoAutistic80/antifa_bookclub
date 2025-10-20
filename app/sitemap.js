export default function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  const base = site.replace(/\/$/, '');
  const url = base ? `${base}/` : '/';
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}

