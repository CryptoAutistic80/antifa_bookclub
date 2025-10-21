import type { Metadata } from 'next';
import Link from 'next/link';

type Ebook = {
  title: string;
  author: string;
  description: string;
  file: string;
};

export const metadata: Metadata = {
  title: 'Free Ebook Library | Anti-Fascist Book Club UK',
  description:
    'Download five cornerstone anti-authoritarian novels in EPUB format, curated by Singularity Shift Ltd for the Anti-Fascist Book Club UK.',
};

const EBOOKS: Ebook[] = [
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    description:
      'Orwell’s allegorical novella that captures the dangers of authoritarian rule and the fragility of collective movements.',
    file: 'Animal Farm - George Orwell.epub',
  },
  {
    title: 'Nineteen Eighty-Four',
    author: 'George Orwell',
    description: 'A stark warning about surveillance, propaganda, and state power that remains chillingly relevant.',
    file: 'Nineteen eighty-four - George Orwell.epub',
  },
  {
    title: 'We',
    author: 'Yevgeny Zamyatin',
    description: 'The proto-dystopian classic that inspired Orwell and Huxley with its critique of engineered conformity.',
    file: 'We - Yevgeny Zamyatin.epub',
  },
  {
    title: 'The Iron Heel',
    author: 'Jack London',
    description: 'A revolutionary narrative exposing oligarchic control and the struggle for organised resistance.',
    file: 'The Iron Heel - Jack London.epub',
  },
  {
    title: 'Looking Backward 2000 to 1887',
    author: 'Edward Bellamy',
    description: 'Bellamy imagines a cooperative future society, offering a hopeful contrast to more oppressive dystopias.',
    file: 'Looking Backward 2000 to 1887 - Edward Bellamy.epub',
  },
];

export default function FreeEbooksPage() {
  return (
    <section className="free-ebooks">
      <div className="free-ebooks__hero">
        <p className="free-ebooks__eyebrow">Free Downloads</p>
        <h1 className="free-ebooks__title">Free Ebook Library</h1>
        <p className="free-ebooks__lede">
          Start a mini anti-fascist library at home. Each EPUB is DRM-free and ready to sideload on your reader of choice.
        </p>
      </div>

      <div className="free-ebooks__grid">
        {EBOOKS.map((book) => {
          const href = `/free-epub/${encodeURIComponent(book.file)}`;
          return (
            <article key={book.file} className="free-ebooks__card">
              <header className="free-ebooks__card-header">
                <h2 className="free-ebooks__card-title">{book.title}</h2>
                <p className="free-ebooks__card-author">by {book.author}</p>
              </header>
              <p className="free-ebooks__card-copy">{book.description}</p>
              <a href={href} download className="free-ebooks__card-link">
                Download EPUB
              </a>
            </article>
          );
        })}
      </div>

      <div className="free-ebooks__cta">
        <Link href="/" className="free-ebooks__cta-link">
          Return to the main experience
        </Link>
      </div>
    </section>
  );
}
