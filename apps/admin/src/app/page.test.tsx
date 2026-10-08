import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AdminPage from './page';

describe('admin page', () => {
  it('renders the admin dashboard and identifies demo data', () => {
    const markup = renderToStaticMarkup(createElement(AdminPage));

    expect(markup).toContain('Bom dia, Ana');
    expect(markup).toContain('Conversas recebidas');
    expect(markup).toContain('Canais de atendimento');
    expect(markup).toContain('Ver caixa de entrada');
    expect(markup).toContain('Dados de demonstração');
    expect(markup).toContain('Em breve');
  });
});
