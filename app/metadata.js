export const metadata = {
  // Prefer clear, branded title
  title: 'Anti-Fascist Book Club UK',
  description:
    'Anti-Fascist Book Club UK — A hub for educational resources, both free and paid.',
  icons: { icon: '/favicon.ico' },
  // If you set NEXT_PUBLIC_SITE_URL, absolute URLs are generated for social cards
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  themeColor: '#0a0a0a',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    title: 'Anti-Fascist Book Club UK',
    siteName: 'Anti-Fascist Book Club UK',
    description:
      'A hub for educational resources, both free and paid.',
    url: '/',
    images: [
      {
        url: '/SEO-image.png',
        width: 1200,
        height: 630,
        alt: 'Anti-Fascist Book Club UK — Educational resources hub',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anti-Fascist Book Club UK',
    description:
      'A hub for educational resources, both free and paid.',
    images: ['/SEO-image.png'],
    // site: '@your_handle',
    // creator: '@your_handle',
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
