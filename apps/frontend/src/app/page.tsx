import { AudioLoop, Background3D, LogoDisplay } from '@/features/landing';
import { StorefrontSection } from '@/features/storefront';

export default function Page() {
  return (
    <div className="app">
      <h1 className="sr-only">
        Anti-Fascist Book Club UK (Antifa) — A hub for educational resources, both free and paid.
      </h1>
      <p className="sr-only">
        Explore antifascist and anti-fascist reading lists, guides, and books — from free PDFs to paid titles — curated by the
        Anti-Fascist Book Club UK (antifa).
      </p>
      <Background3D />
      <LogoDisplay />
      <AudioLoop />
      <StorefrontSection />
    </div>
  );
}
