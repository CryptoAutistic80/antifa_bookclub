import Image from 'next/image';
import Link from 'next/link';
import './globals.css';

export { metadata, viewport } from './metadata';

const navLinks = [
  { href: '/', label: 'Home' },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="site-body">
        <div className="site-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
