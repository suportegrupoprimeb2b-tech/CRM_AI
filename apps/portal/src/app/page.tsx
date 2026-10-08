'use client';

import { useMemo, useState } from 'react';
import React from 'react';

type Page = 'home' | 'quotes' | 'tracking' | 'finance';
type IconName =
  | 'arrow'
  | 'bell'
  | 'box'
  | 'calendar'
  | 'check'
  | 'chevron'
  | 'clock'
  | 'download'
  | 'file'
  | 'grid'
  | 'help'
  | 'inbox'
  | 'logout'
  | 'search'
  | 'settings'
  | 'sparkles'
  | 'wallet';

const iconPaths: Record<IconName, string> = {
  arrow: 'M7 17 17 7M7 7h10v10',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  box: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7 12 12l8.7-5M12 22V12',
  calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
  check: 'm5 12 4 4L19 6',
  chevron: 'm9 18 6-6-6-6',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 15h8m-8 4h8',
  grid: 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z',
  help: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  inbox: 'M4 4h16l2 11h-6l-2 3h-4l-2-3H2L4 4Zm0 0 2 7h12l2-7',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9',
  search: 'm21 21-4.3-4.3M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3m10-10h-3M5 12H2m17.1-7.1L17 7m-10 10-2.1 2.1M19.1 19.1 17 17M7 7 4.9 4.9',
  sparkles: 'm12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z',
  wallet: 'M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6m18 7h-4a2 2 0 0 0 0 4h4v-4Zm-4 2h.01',
};

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

const quotes = [
  { number: 'ORC-2026-0148', title: 'Componentes hidráulicos', date: '08 out, 2026', amount: 12840, status: 'Aguardando aprovação' },
  { number: 'ORC-2026-0144', title: 'Equipamentos de proteção', date: '06 out, 2026', amount: 5120, status: 'Aguardando aprovação' },
  { number: 'ORC-2026-0139', title: 'Materiais de instalação', date: '04 out, 2026', amount: 6840, status: 'Aprovada' },
  { number: 'ORC-2026-0121', title: 'Kit de manutenção industrial', date: '28 set, 2026', amount: 3290, status: 'Aprovada' },
  { number: 'ORC-2026-0107', title: 'Válvulas e conexões', date: '19 set, 2026', amount: 4720, status: 'Expirada' },
];

const payments = [
  { description: 'Materiais de instalação', reference: 'ORC-2026-0139', due: '15 out, 2026', amount: 6840, status: 'Pendente' },
  { description: 'Kit de manutenção industrial', reference: 'ORC-2026-0121', due: '10 out, 2026', amount: 3290, status: 'Pago' },
  { description: 'Componentes hidráulicos', reference: 'ORC-2026-0148', due: '22 out, 2026', amount: 12840, status: 'Pendente' },
];

const statusClass: Record<string, string> = {
  'Aguardando aprovação': 'waiting',
  Aprovada: 'approved',
  Expirada: 'expired',
  Pendente: 'waiting',
  Pago: 'approved',
};

const formatCurrency = (amount: number) =>
  amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function Logo() {
  return (
    <a className="portal-brand" href="#inicio" aria-label="Prime, início">
      <span className="portal-brand-mark"><Icon name="grid" size={18} /></span>
      <span>prime<span>+</span></span>
    </a>
  );
}

function Sidebar({
  activePage,
  onNavigate,
}: {
  activePage: Page;
  onNavigate: (page: Page) => void;
}) {
  const primaryLinks: { id: Page; label: string; icon: IconName }[] = [
    { id: 'home', label: 'Início', icon: 'grid' },
    { id: 'quotes', label: 'Minhas cotações', icon: 'file' },
    { id: 'tracking', label: 'Pedidos e entregas', icon: 'box' },
    { id: 'finance', label: 'Financeiro', icon: 'wallet' },
  ];

  return (
    <aside className="portal-sidebar">
      <Logo />
      <div className="portal-side-caption">ÁREA DO CLIENTE</div>
      <nav className="portal-nav" aria-label="Menu do portal">
        {primaryLinks.map((link) => (
          <button
            className={`portal-nav-link ${activePage === link.id ? 'active' : ''}`}
            key={link.id}
            onClick={() => onNavigate(link.id)}
            type="button"
          >
            <Icon name={link.icon} size={18} />
            <span>{link.label}</span>
            {link.id === 'quotes' && <span className="nav-indicator">2</span>}
          </button>
        ))}
      </nav>

      <div className="portal-sidebar-bottom">
        <div className="portal-help-card">
          <span className="portal-help-icon"><Icon name="help" size={17} /></span>
          <strong>Precisa de ajuda?</strong>
          <p>Nosso time está pronto para ajudar você.</p>
          <button type="button" disabled>Falar com atendimento <span>Em breve</span></button>
        </div>
        <button className="portal-nav-link muted-link" type="button" disabled>
          <Icon name="settings" size={18} /><span>Configurações</span><small>Em breve</small>
        </button>
        <div className="portal-user">
          <span className="portal-user-avatar">MC</span>
          <span className="portal-user-copy"><strong>Mariana Costa</strong><small>Cliente demonstração</small></span>
          <button type="button" aria-label="Sair" className="logout-button" disabled><Icon name="logout" size={17} /></button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ activePage }: { activePage: Page }) {
  const titles: Record<Page, string> = {
    home: 'Início',
    quotes: 'Minhas cotações',
    tracking: 'Pedidos e entregas',
    finance: 'Financeiro',
  };

  return (
    <header className="portal-topbar">
      <div className="portal-breadcrumb"><span>Área do cliente</span><Icon name="chevron" size={14} /><strong>{titles[activePage]}</strong></div>
      <div className="portal-top-actions">
        <span className="client-pill"><span /> Conta de demonstração</span>
        <button type="button" className="portal-icon-button" aria-label="Notificações"><Icon name="bell" size={19} /><i /></button>
        <span className="top-divider" />
        <span className="portal-mini-avatar">MC</span>
      </div>
    </header>
  );
}

function DemoNotice() {
  return (
    <div className="portal-demo-notice">
      <span className="notice-icon"><Icon name="sparkles" size={16} /></span>
      <span><strong>Portal de demonstração.</strong> Os dados exibidos são fictícios e não representam pedidos ou cobranças reais.</span>
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="portal-page-heading">
      <div>
        <div className="portal-eyebrow"><span />{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge ${statusClass[status] ?? 'neutral'}`}><i />{status}</span>;
}

function QuoteTable({
  items,
  compact = false,
}: {
  items: typeof quotes;
  compact?: boolean;
}) {
  return (
    <div className="table-scroll">
      <table className={`portal-table ${compact ? 'compact-table' : ''}`}>
        <thead><tr><th>COTAÇÃO</th><th>DATA</th><th>VALOR</th><th>STATUS</th><th aria-label="Ações" /></tr></thead>
        <tbody>
          {items.map((quote) => (
            <tr key={quote.number}>
              <td><div className="quote-title"><span className="document-icon"><Icon name="file" size={16} /></span><span><strong>{quote.title}</strong><small>{quote.number}</small></span></div></td>
              <td className="muted-cell">{quote.date}</td>
              <td className="amount-cell">{formatCurrency(quote.amount)}</td>
              <td><StatusBadge status={quote.status} /></td>
              <td><button type="button" className="row-action" aria-label={`Ver ${quote.number}`} disabled><Icon name="chevron" size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <PageHeading
        eyebrow="VISÃO DA SUA CONTA"
        title={<>Olá, Mariana <span className="hello-star">✳</span></>}
        description="Aqui você acompanha suas cotações e mantém tudo organizado."
        action={<button className="portal-date-button" type="button" disabled><Icon name="calendar" size={16} /> Outubro, 2026</button>}
      />
      <DemoNotice />

      <section className="welcome-card">
        <div className="welcome-copy">
          <span className="welcome-kicker">BEM-VINDA À PRIME</span>
          <h2>Seu negócio mais perto<br />de quem faz acontecer.</h2>
          <p>Acompanhe suas cotações, pedidos e informações financeiras em um só lugar.</p>
          <button type="button" onClick={() => onNavigate('quotes')}>Acompanhar cotações <Icon name="arrow" size={15} /></button>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="art-orbit orbit-one" />
          <span className="art-orbit orbit-two" />
          <span className="art-card"><Icon name="file" size={24} /><i><Icon name="check" size={13} /></i></span>
          <span className="art-bubble bubble-one"><Icon name="box" size={18} /></span>
          <span className="art-bubble bubble-two"><Icon name="wallet" size={17} /></span>
          <span className="art-sparkle sparkle-one">✳</span>
          <span className="art-sparkle sparkle-two">✦</span>
        </div>
        <span className="welcome-decoration decoration-one" />
        <span className="welcome-decoration decoration-two" />
      </section>

      <section className="portal-stats" aria-label="Resumo demonstrativo da conta">
        <article className="portal-stat-card">
          <span className="stat-icon stat-green"><Icon name="file" size={18} /></span>
          <span className="stat-label">Cotações em aberto</span>
          <strong>02</strong>
          <span className="stat-foot">Aguardando sua aprovação</span>
        </article>
        <article className="portal-stat-card">
          <span className="stat-icon stat-lilac"><Icon name="box" size={18} /></span>
          <span className="stat-label">Pedidos em andamento</span>
          <strong>—</strong>
          <span className="stat-foot">Sem pedidos conectados</span>
        </article>
        <article className="portal-stat-card">
          <span className="stat-icon stat-amber"><Icon name="wallet" size={18} /></span>
          <span className="stat-label">Contas a pagar</span>
          <strong>R$ 6.840</strong>
          <span className="stat-foot">Valor ilustrativo</span>
        </article>
      </section>

      <section className="portal-panel quote-panel">
        <div className="portal-panel-heading">
          <div><h2>Cotações recentes</h2><p>Propostas comerciais preparadas para você</p></div>
          <button className="portal-link-button" type="button" onClick={() => onNavigate('quotes')}>Ver todas <Icon name="arrow" size={14} /></button>
        </div>
        <QuoteTable items={quotes.slice(0, 3)} compact />
      </section>

      <section className="bottom-panels">
        <article className="portal-panel shipment-panel">
          <div className="portal-panel-heading">
            <div><h2>Pedidos e entregas</h2><p>Acompanhe o andamento dos seus pedidos</p></div>
            <span className="panel-icon"><Icon name="box" size={17} /></span>
          </div>
          <div className="empty-tracking">
            <span className="empty-track-icon"><Icon name="box" size={20} /></span>
            <div><strong>Nenhum pedido conectado</strong><span>Quando houver pedidos disponíveis, eles aparecerão aqui.</span></div>
          </div>
          <button className="subtle-link" type="button" onClick={() => onNavigate('tracking')}>Sobre o acompanhamento <Icon name="chevron" size={14} /></button>
        </article>
        <article className="portal-panel contact-panel">
          <span className="contact-decoration"><Icon name="sparkles" size={18} /></span>
          <span className="contact-kicker">ESTAMOS POR AQUI</span>
          <h2>Conte com a gente.</h2>
          <p>Precisa de ajuda com uma cotação ou quer conversar com nosso time?</p>
          <button type="button" disabled>Falar com atendimento <span>Em breve</span></button>
        </article>
      </section>

      <PortalFooter />
    </>
  );
}

function QuotesPage() {
  const [search, setSearch] = useState('');
  const filteredQuotes = useMemo(
    () => quotes.filter((quote) => `${quote.number} ${quote.title} ${quote.status}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))),
    [search],
  );

  return (
    <>
      <PageHeading eyebrow="COMERCIAL" title="Minhas cotações" description="Consulte as propostas comerciais da sua conta." />
      <DemoNotice />
      <section className="portal-panel full-list-panel">
        <div className="portal-panel-heading">
          <div><h2>Suas propostas</h2><p>{quotes.length} cotações de demonstração</p></div>
          <label className="portal-search"><Icon name="search" size={16} /><input aria-label="Buscar cotação" placeholder="Buscar cotação..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        </div>
        {filteredQuotes.length > 0
          ? <QuoteTable items={filteredQuotes} />
          : <div className="no-results">Nenhuma cotação encontrada.</div>}
      </section>
      <PortalFooter />
    </>
  );
}

function TrackingPage() {
  return (
    <>
      <PageHeading eyebrow="LOGÍSTICA" title="Pedidos e entregas" description="Consulte o status dos seus pedidos e informações de entrega." />
      <DemoNotice />
      <section className="portal-panel tracking-empty-panel">
        <span className="tracking-empty-illustration"><Icon name="box" size={30} /></span>
        <span className="empty-eyebrow">ACOMPANHAMENTO</span>
        <h2>Seus pedidos aparecerão aqui.</h2>
        <p>Este portal ainda não está conectado a um sistema de pedidos ou rastreio logístico. Quando a integração estiver disponível, você poderá acompanhar atualizações por aqui.</p>
        <span className="tracking-status"><i /> Integração de pedidos não configurada</span>
      </section>
      <PortalFooter />
    </>
  );
}

function FinancePage() {
  return (
    <>
      <PageHeading
        eyebrow="FINANCEIRO"
        title="Financeiro"
        description="Acompanhe informações financeiras vinculadas às suas cotações."
        action={<button className="portal-date-button" type="button" disabled><Icon name="download" size={16} /> Exportar <span>Em breve</span></button>}
      />
      <DemoNotice />
      <section className="finance-stats">
        <article className="portal-stat-card finance-stat">
          <span className="stat-icon stat-amber"><Icon name="wallet" size={18} /></span>
          <span className="stat-label">Total em aberto</span>
          <strong>{formatCurrency(19680)}</strong>
          <span className="stat-foot">Valores de demonstração</span>
        </article>
        <article className="portal-stat-card finance-stat">
          <span className="stat-icon stat-green"><Icon name="check" size={18} /></span>
          <span className="stat-label">Pagamentos registrados</span>
          <strong>01</strong>
          <span className="stat-foot">Exemplo de pagamento</span>
        </article>
        <article className="portal-stat-card finance-stat">
          <span className="stat-icon stat-blue"><Icon name="clock" size={18} /></span>
          <span className="stat-label">Próximo vencimento</span>
          <strong>15 out</strong>
          <span className="stat-foot">Data fictícia</span>
        </article>
      </section>
      <section className="portal-panel full-list-panel">
        <div className="portal-panel-heading"><div><h2>Lançamentos</h2><p>Resumo financeiro de demonstração</p></div></div>
        <div className="table-scroll">
          <table className="portal-table finance-table">
            <thead><tr><th>DESCRIÇÃO</th><th>REFERÊNCIA</th><th>VENCIMENTO</th><th>VALOR</th><th>STATUS</th></tr></thead>
            <tbody>{payments.map((payment) => (
              <tr key={payment.reference}>
                <td><div className="quote-title"><span className="document-icon"><Icon name="wallet" size={16} /></span><strong>{payment.description}</strong></div></td>
                <td className="muted-cell">{payment.reference}</td>
                <td className="muted-cell">{payment.due}</td>
                <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                <td><StatusBadge status={payment.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="finance-disclaimer"><Icon name="help" size={15} /> Estes lançamentos são fictícios. Nenhuma cobrança ou pagamento real está conectado.</div>
      </section>
      <PortalFooter />
    </>
  );
}

function PortalFooter() {
  return <footer className="portal-footer"><span>Prime+ <i>•</i> Portal do cliente</span><span>Ambiente de demonstração</span></footer>;
}

export default function PortalPage() {
  const [activePage, setActivePage] = useState<Page>('home');

  return (
    <div className="portal-app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="portal-main-column">
        <Topbar activePage={activePage} />
        <main className="portal-main">
          {activePage === 'home' && <Overview onNavigate={setActivePage} />}
          {activePage === 'quotes' && <QuotesPage />}
          {activePage === 'tracking' && <TrackingPage />}
          {activePage === 'finance' && <FinancePage />}
        </main>
      </div>
    </div>
  );
}
