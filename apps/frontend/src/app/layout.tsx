import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import type { PropsWithChildren, ReactNode } from 'react';

import { Providers } from './providers';

import './globals.css';

export { metadata, viewport } from './metadata';

type RootLayoutProps = PropsWithChildren<{ children: ReactNode }>;

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Store' },
  { href: '/free-ebooks', label: 'Free Ebook Library' },
];

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          <Image
            src="/logo1.png"
            alt="Anti-Fascist Book Club UK"
            width={120}
            height={120}
            className="site-brand__logo"
            priority
          />
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">
          &copy; {year} Anti-Fascist Book Club UK · Singularity Shift Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="site-body">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E4WF4JENE8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-E4WF4JENE8');`}
        </Script>
        <Providers>
          <div className="site-shell">
            <Header />
            <main className="site-main">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
