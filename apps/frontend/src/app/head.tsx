export default function Head() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  const base = site.replace(/\/$/, '');
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Anti-Fascist Book Club UK',
    url: base || undefined,
    description:
      'Anti-Fascist Book Club UK — A hub for educational resources, both free and paid. Antifa reading and learning resources.',
  } as const;
  const webLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Anti-Fascist Book Club UK',
    url: base || undefined,
  } as const;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webLd) }} />
    </>
  );
}
