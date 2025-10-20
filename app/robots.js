export default function robots() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  const base = site.replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}

