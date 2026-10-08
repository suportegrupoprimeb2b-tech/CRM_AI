import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PortalPage from './page';

describe('portal page', () => {
  it('renders customer portal navigation and the demo dashboard', () => {
    const markup = renderToStaticMarkup(createElement(PortalPage));

    expect(markup).toContain('Olá, Mariana');
    expect(markup).toContain('Minhas cotações');
    expect(markup).toContain('Pedidos e entregas');
    expect(markup).toContain('Financeiro');
    expect(markup).toContain('Portal de demonstração.');
  });

  it('does not imply live order or payment integrations', () => {
    const markup = renderToStaticMarkup(createElement(PortalPage));

    expect(markup).toContain('Nenhum pedido conectado');
    expect(markup).toContain('não representam pedidos ou cobranças reais');
    expect(markup).toContain('Falar com atendimento');
  });

  it('shows sample quotes with explicit demo context', () => {
    const markup = renderToStaticMarkup(createElement(PortalPage));

    expect(markup).toContain('ORC-2026-0148');
    expect(markup).toContain('Aguardando aprovação');
    expect(markup).toContain('fictícios');
  });
});
