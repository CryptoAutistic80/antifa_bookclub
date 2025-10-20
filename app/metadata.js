export const metadata = {
  // Clean, concise title + description for embeds
  title: 'Anti-Fascist Book Club UK',
  description:
    'Antifa/anti-fascist reading lists and resources — free and paid.',
  icons: { icon: '/favicon.ico' },
  // If you set NEXT_PUBLIC_SITE_URL, absolute URLs are generated for social cards
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://antifa.city'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    title: 'Anti-Fascist Book Club UK',
    siteName: 'Anti-Fascist Book Club UK',
    description: 'Antifa/anti-fascist reading lists and resources — free and paid.',
    url: '/',
    images: [
      {
        url: '/SEO-image-v2.png',
        width: 1200,
        height: 630,
        alt: 'Anti-Fascist Book Club UK — Educational resources hub',
        type: 'image/png',
      },
      // Fallback to original filename if needed
      {
        url: '/SEO-image.png',
        width: 1200,
        height: 630,
        alt: 'Anti-Fascist Book Club UK — Educational resources hub',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anti-Fascist Book Club UK',
    description: 'Antifa/anti-fascist reading lists and resources — free and paid.',
    images: ['/SEO-image-v2.png'],
    // site: '@your_handle',
    // creator: '@your_handle',
  },
  // Extra tags for some scrapers that can be picky
  other: {
    'og:image:secure_url': 'https://antifa.city/SEO-image-v2.png',
    'twitter:image:src': 'https://antifa.city/SEO-image-v2.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    'Anti-Fascist Book Club UK',
    'antifascist',
    'anti-fascist',
    'antifa',
    'antifa uk',
    'books',
    'education',
    'resources',
    'reading',
    'library',
    'learning',
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
};
