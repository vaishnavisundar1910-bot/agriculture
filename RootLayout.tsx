import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement } from 'react';
import { ScrollRestoration } from 'react-router-dom';

interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Helmet>
        <title>AgriVet AI — AI-Powered Agriculture & Livestock Platform</title>
        <meta name="description" content="AgriVet AI helps Tamil Nadu farmers with crop guidance, livestock health, government schemes, disease detection, weather updates, and market prices in Tamil and English." />
      </Helmet>
      <ScrollRestoration />
      {children}
    </>
  );
}
