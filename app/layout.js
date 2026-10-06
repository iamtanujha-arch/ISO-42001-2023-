import './globals.css';

export const metadata = {
  title: 'ISO 42001:2023 Compliance Suite — Document Browser',
  description: 'Browse the ISO 42001 AI Management System compliance documents, guidance, and previews.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
