import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Prime CRM | Atendimento',
  description: 'Painel de atendimento e relacionamento B2B da Prime CRM.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
