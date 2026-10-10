import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Kruu · A better time for outdoor work',
  description:
    'Turn a Miami crew work order into a forecast-aware schedule. Preserve the work, the break, and the paid shift.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
