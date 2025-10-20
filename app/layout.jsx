export const metadata = {
  title: 'Anti-Fascist 3D Experience',
  description: 'An immersive React/Three.js site: resistance through knowledge.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

