import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Prime+ | Portal do cliente',
  description: 'Acompanhe cotações, pedidos e informações financeiras da sua conta.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
