'use client';

import React, { useMemo, useState } from 'react';

type IconName =
  | 'activity'
  | 'arrow'
  | 'bell'
  | 'briefcase'
  | 'calendar'
  | 'check'
  | 'chevron'
  | 'clock'
  | 'dots'
  | 'filter'
  | 'grid'
  | 'help'
  | 'inbox'
  | 'message'
  | 'plus'
  | 'search'
  | 'send'
  | 'settings'
  | 'sparkles'
  | 'trend'
  | 'users';

const iconPaths: Record<IconName, string> = {
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  arrow: 'M7 17 17 7M7 7h10v10',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  briefcase: 'M3 7h18v14H3zM8 7V4h8v3M3 12h18M10 12v2h4v-2',
  calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
  check: 'm5 12 4 4L19 6',
  chevron: 'm9 18 6-6-6-6',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2',
  dots: 'M5 12h.01M12 12h.01M19 12h.01',
  filter: 'M4 7h16M7 12h10m-7 5h4',
  grid: 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z',
  help: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  inbox: 'M4 4h16l2 11h-6l-2 3h-4l-2-3H2L4 4Zm0 0 2 7h12l2-7',
  message: 'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z',
  plus: 'M12 5v14m-7-7h14',
  search: 'm21 21-4.3-4.3M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z',
  send: 'm22 2-7 20-4-9-9-4 20-7ZM22 2 11 13',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3m10-10h-3M5 12H2m17.1-7.1L17 7m-10 10-2.1 2.1M19.1 19.1 17 17M7 7 4.9 4.9',
  sparkles: 'm12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z',
  trend: 'm3 17 6-6 4 4 8-8m-6 0h6v6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 10v-2a4 4 0 0 0-3-3.9m-1-12a4 4 0 0 1 0 7.8',
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
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

const conversations = [
  {
    id: 1,
    name: 'Mariana Costa',
    company: 'Costa & Filhos Distribuidora',
    initials: 'MC',
    color: 'lilac',
    time: '10:42',
    preview: 'Consegue me enviar a cotação atualizada?',
    unread: 2,
    online: true,
    messages: [
      { from: 'them', text: 'Bom dia! Tudo bem por aí?', time: '10:36' },
      { from: 'me', text: 'Bom dia, Mariana! Tudo ótimo. Como posso ajudar?', time: '10:39' },
      { from: 'them', text: 'Consegue me enviar a cotação atualizada?', time: '10:42' },
    ],
  },
  {
    id: 2,
    name: 'Rafael Mendes',
    company: 'Grupo Mendes Comércio',
    initials: 'RM',
    color: 'blue',
    time: '10:18',
    preview: 'Perfeito, fico no aguardo. Obrigado!',
    unread: 0,
    online: true,
    messages: [
      { from: 'them', text: 'Vocês atendem a região de Campinas?', time: '10:12' },
      { from: 'me', text: 'Sim! Atendemos Campinas e região.', time: '10:15' },
      { from: 'them', text: 'Perfeito, fico no aguardo. Obrigado!', time: '10:18' },
    ],
  },
  {
    id: 3,
    name: 'Fernanda Oliveira',
    company: 'Oliveira Materiais',
    initials: 'FO',
    color: 'peach',
    time: '09:54',
    preview: 'Recebi os produtos, tudo certinho 🙌',
    unread: 0,
    online: false,
    messages: [
      { from: 'them', text: 'Oi! Passando para confirmar o pedido.', time: '09:48' },
      { from: 'me', text: 'Claro, Fernanda. Como podemos ajudar?', time: '09:51' },
      { from: 'them', text: 'Recebi os produtos, tudo certinho 🙌', time: '09:54' },
    ],
  },
  {
    id: 4,
    name: 'André Lima',
    company: 'Lima Soluções Industriais',
    initials: 'AL',
    color: 'mint',
    time: 'Ontem',
    preview: 'Vou validar com o meu time e retorno.',
    unread: 0,
    online: false,
    messages: [
      { from: 'me', text: 'Enviei os detalhes por e-mail também.', time: '16:08' },
      { from: 'them', text: 'Vou validar com o meu time e retorno.', time: '16:20' },
    ],
  },
] as const;

type Conversation = (typeof conversations)[number];
type Section = 'overview' | 'inbox';

const chartValues = [32, 43, 39, 55, 48, 62, 50, 66, 57, 76, 67, 86];
const chartPoints = chartValues
  .map((value, index) => `${index * 60},${112 - value}`)
  .join(' ');

function BrandMark() {
  return (
    <span className="brand-mark">
      <Icon name="message" size={19} />
    </span>
  );
}

function Sidebar({
  activeSection,
  onNavigate,
}: {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}) {
  return (
    <aside className="sidebar">
      <a
        className="brand"
        href="#inicio"
        onClick={() => onNavigate('overview')}
        aria-label="Prime CRM, início"
      >
        <BrandMark />
        <span className="brand-name">prime<span>crm</span></span>
      </a>

      <div className="workspace-switcher">
        <div className="workspace-avatar">P</div>
        <div className="workspace-copy">
          <span>Espaço de trabalho</span>
          <strong>Prime B2B</strong>
        </div>
        <span className="workspace-chevron"><Icon name="chevron" size={15} /></span>
      </div>

      <nav className="side-navigation" aria-label="Navegação principal">
        <span className="nav-caption">VISÃO GERAL</span>
        <button
          className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => onNavigate('overview')}
          type="button"
        >
          <Icon name="grid" size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-item ${activeSection === 'inbox' ? 'active' : ''}`}
          onClick={() => onNavigate('inbox')}
          type="button"
        >
          <Icon name="inbox" size={18} />
          <span>Conversas</span>
          <span className="nav-count">1</span>
        </button>

        <span className="nav-caption nav-caption-spaced">RELACIONAMENTO</span>
        <span className="nav-item nav-disabled">
          <Icon name="users" size={18} />
          <span>Clientes</span>
          <span className="soon-label">EM BREVE</span>
        </span>
        <span className="nav-item nav-disabled">
          <Icon name="briefcase" size={18} />
          <span>Cotações</span>
        </span>

        <span className="nav-caption nav-caption-spaced">GESTÃO</span>
        <span className="nav-item nav-disabled">
          <Icon name="activity" size={18} />
          <span>Relatórios</span>
        </span>
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <span className="upgrade-icon"><Icon name="sparkles" size={17} /></span>
          <strong>Seu negócio, em sintonia.</strong>
          <span>Organize conversas e oportunidades em um só lugar.</span>
          <button type="button" onClick={() => onNavigate('inbox')}>
            Explorar conversas <Icon name="arrow" size={14} />
          </button>
        </div>
        <span className="nav-item nav-disabled account-link">
          <Icon name="settings" size={18} />
          <span>Configurações</span>
        </span>
        <div className="profile-card">
          <div className="profile-avatar">AC</div>
          <div className="profile-copy"><strong>Ana Costa</strong><span>Administradora</span></div>
          <button aria-label="Mais opções de perfil" type="button" className="icon-button subtle-button">
            <Icon name="dots" size={19} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function Header({
  activeSection,
  onNavigate,
}: {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}) {
  const sectionTitle = activeSection === 'overview' ? 'Visão geral' : 'Conversas';

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Painel</span><Icon name="chevron" size={14} /><strong>{sectionTitle}</strong>
      </div>
      <div className="topbar-actions">
        <span className="demo-status"><span /> Ambiente de demonstração</span>
        <button className="icon-button notification-button" aria-label="Notificações" type="button">
          <Icon name="bell" size={19} /><i />
        </button>
        <span className="topbar-divider" />
        <button className="topbar-profile" onClick={() => onNavigate('overview')} type="button">
          <span className="profile-avatar small-avatar">AC</span>
          <span>Ana Costa</span>
          <Icon name="chevron" size={15} />
        </button>
      </div>
    </header>
  );
}

function MetricCard({
  label,
  value,
  change,
  icon,
  tone,
  detail,
}: {
  label: string;
  value: string;
  change: string;
  icon: IconName;
  tone: string;
  detail: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}`}><Icon name={icon} size={18} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        <span className="metric-change"><Icon name="trend" size={14} /> {change}</span>
        <span>{detail}</span>
      </div>
    </article>
  );
}

function ActivityChart() {
  return (
    <div className="chart-wrap">
      <div className="chart-y-labels"><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div>
      <div className="chart-plot">
        <div className="chart-grid"><i /><i /><i /><i /><i /></div>
        <svg className="chart-svg" viewBox="0 0 660 120" preserveAspectRatio="none" role="img" aria-label="Gráfico ilustrativo de conversas ao longo da semana">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#19a879" stopOpacity=".17" />
              <stop offset="100%" stopColor="#19a879" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,120 ${chartPoints} 660,120`} fill="url(#chartFill)" />
          <polyline points={chartPoints} fill="none" stroke="#159b6d" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="600" cy="45" r="5" fill="#fff" stroke="#159b6d" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="chart-x-labels"><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span></div>
      </div>
    </div>
  );
}

function ConversationRow({
  conversation,
  onSelect,
}: {
  conversation: Conversation;
  onSelect: () => void;
}) {
  return (
    <button className="conversation-row" onClick={onSelect} type="button">
      <span className={`conversation-avatar ${conversation.color}`}>
        {conversation.initials}{conversation.online && <i />}
      </span>
      <span className="conversation-summary">
        <span className="conversation-name-line"><strong>{conversation.name}</strong><time>{conversation.time}</time></span>
        <span className="conversation-company">{conversation.company}</span>
        <span className="conversation-preview">{conversation.preview}</span>
      </span>
      {conversation.unread > 0 && <span className="unread-badge">{conversation.unread}</span>}
    </button>
  );
}

function Overview({
  onOpenInbox,
}: {
  onOpenInbox: () => void;
}) {
  const [period, setPeriod] = useState('Esta semana');
  const [showDemoNotice, setShowDemoNotice] = useState(true);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> PAINEL DE ATENDIMENTO <span>•</span> DADOS ILUSTRATIVOS</div>
          <h1>Bom dia, Ana <span className="wave">✳</span></h1>
          <p>Acompanhe o ritmo do seu negócio e fique perto dos seus clientes.</p>
        </div>
        <button className="date-picker" onClick={() => setPeriod(period === 'Esta semana' ? 'Últimos 7 dias' : 'Esta semana')} type="button">
          <Icon name="calendar" size={17} /> {period} <Icon name="chevron" size={15} />
        </button>
      </div>

      {showDemoNotice && (
        <div className="demo-banner">
          <span className="demo-banner-icon"><Icon name="sparkles" size={17} /></span>
          <span><strong>Uma visão clara de tudo.</strong> Os indicadores abaixo são ilustrativos e serão conectados aos dados da sua operação.</span>
          <button aria-label="Fechar aviso" type="button" onClick={() => setShowDemoNotice(false)}>×</button>
        </div>
      )}

      <section className="metrics-grid" aria-label="Indicadores ilustrativos">
        <MetricCard label="Conversas recebidas" value="248" change="+12,8%" detail="vs. semana passada" icon="message" tone="green" />
        <MetricCard label="Em atendimento" value="18" change="+4 hoje" detail="conversas ativas" icon="inbox" tone="violet" />
        <MetricCard label="Tempo de resposta" value="4 min" change="−18,2%" detail="mais rápido" icon="clock" tone="amber" />
        <MetricCard label="Clientes atendidos" value="136" change="+8,4%" detail="vs. semana passada" icon="users" tone="blue" />
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-header">
            <div><h2>Visão de atendimento</h2><p>Conversas recebidas ao longo do período</p></div>
            <button className="select-button" onClick={() => setPeriod(period === 'Esta semana' ? 'Últimos 7 dias' : 'Esta semana')} type="button">
              {period}<Icon name="chevron" size={14} />
            </button>
          </div>
          <div className="chart-legend"><span /><strong>Conversas</strong><small>por dia</small></div>
          <ActivityChart />
          <div className="chart-summary">
            <div><span>Total no período</span><strong>248 <small>conversas</small></strong></div>
            <div className="chart-summary-note"><span className="metric-change"><Icon name="trend" size={14} /> 12,8%</span><span>em relação ao período anterior</span></div>
          </div>
        </article>

        <article className="panel channels-panel">
          <div className="panel-header">
            <div><h2>Canais de atendimento</h2><p>Visão geral dos seus canais</p></div>
            <button className="icon-button subtle-button" aria-label="Mais opções de canais" type="button"><Icon name="dots" size={20} /></button>
          </div>
          <div className="channel-highlight">
            <span className="whatsapp-mark">w</span>
            <div><strong>WhatsApp</strong><span>Canal de demonstração</span></div>
            <span className="channel-state"><i /> Exemplo</span>
          </div>
          <div className="channel-stats">
            <div><span>Conversas</span><strong>182</strong></div>
            <div><span>Aguardando</span><strong>08</strong></div>
          </div>
          <div className="channel-note"><Icon name="help" size={15} /> Este canal ainda não está conectado.</div>
          <button className="connect-button" type="button" disabled><Icon name="plus" size={16} /> Conectar canal <span>Em breve</span></button>
        </article>
      </section>

      <section className="panel recent-panel" id="conversas-recentes">
        <div className="panel-header recent-header">
          <div><h2>Conversas recentes</h2><p>Fique por dentro dos últimos contatos</p></div>
          <button className="text-button" onClick={onOpenInbox} type="button">Ver caixa de entrada <Icon name="arrow" size={15} /></button>
        </div>
        <div className="recent-list">
          {conversations.slice(0, 3).map((conversation) => (
            <ConversationRow key={conversation.id} conversation={conversation} onSelect={onOpenInbox} />
          ))}
        </div>
      </section>
      <footer className="page-footer"><span>Prime CRM <span>•</span> Painel de atendimento</span><span>Dados de demonstração</span></footer>
    </>
  );
}

function Inbox({ onBack }: { onBack: () => void }) {
  const [selectedId, setSelectedId] = useState<number>(conversations[0].id);
  const [query, setQuery] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);
  const selectedConversation = conversations.find(({ id }) => id === selectedId) ?? conversations[0];
  const filteredConversations = useMemo(
    () => conversations.filter((conversation) => {
      const matchesQuery = `${conversation.name} ${conversation.company} ${conversation.preview}`
        .toLocaleLowerCase('pt-BR')
        .includes(query.toLocaleLowerCase('pt-BR'));
      return matchesQuery && (!filterUnread || conversation.unread > 0);
    }),
    [filterUnread, query],
  );

  return (
    <>
      <div className="page-heading inbox-heading">
        <div>
          <button className="back-link" onClick={onBack} type="button"><Icon name="chevron" size={15} /> Voltar ao painel</button>
          <h1>Caixa de entrada</h1>
          <p>Suas conversas em um só lugar, com contexto para atender melhor.</p>
        </div>
        <span className="inbox-demo-pill"><span /> Caixa de demonstração</span>
      </div>

      <section className="inbox-workspace" aria-label="Caixa de entrada de demonstração">
        <div className="inbox-list-panel">
          <div className="inbox-list-heading"><div><h2>Conversas</h2><span>{conversations.length} exemplos</span></div><button className="icon-button subtle-button" type="button" aria-label="Filtros"><Icon name="filter" size={18} /></button></div>
          <label className="search-field inbox-search"><Icon name="search" size={17} /><input aria-label="Buscar conversa" placeholder="Buscar conversa..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <div className="inbox-tabs">
            <button className={!filterUnread ? 'selected' : ''} onClick={() => setFilterUnread(false)} type="button">Todas <span>{conversations.length}</span></button>
            <button className={filterUnread ? 'selected' : ''} onClick={() => setFilterUnread(true)} type="button">Não lidas <span>1</span></button>
          </div>
          <div className="inbox-contact-list">
            {filteredConversations.length > 0 ? filteredConversations.map((conversation) => (
              <button
                className={`inbox-contact ${selectedId === conversation.id ? 'selected' : ''}`}
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                type="button"
              >
                <span className={`conversation-avatar ${conversation.color}`}>{conversation.initials}{conversation.online && <i />}</span>
                <span className="conversation-summary">
                  <span className="conversation-name-line"><strong>{conversation.name}</strong><time>{conversation.time}</time></span>
                  <span className="conversation-preview">{conversation.preview}</span>
                </span>
                {conversation.unread > 0 && <span className="unread-badge">{conversation.unread}</span>}
              </button>
            )) : <p className="empty-search">Nenhuma conversa encontrada.</p>}
          </div>
        </div>

        <div className="chat-panel">
          <div className="chat-header">
            <span className={`conversation-avatar ${selectedConversation.color}`}>{selectedConversation.initials}{selectedConversation.online && <i />}</span>
            <div className="chat-contact"><strong>{selectedConversation.name}</strong><span>{selectedConversation.company}</span></div>
            <span className="chat-channel"><span className="whatsapp-mini">w</span> WhatsApp <span className="demo-tag">DEMO</span></span>
            <button className="icon-button subtle-button chat-options" type="button" aria-label="Opções da conversa"><Icon name="dots" size={20} /></button>
          </div>
          <div className="chat-context-note"><Icon name="sparkles" size={15} /> Histórico ilustrativo para apresentar a experiência de atendimento.</div>
          <div className="chat-messages">
            <div className="chat-date"><span>Hoje</span></div>
            {selectedConversation.messages.map((message, index) => (
              <div className={`message-line ${message.from === 'me' ? 'outgoing' : ''}`} key={`${selectedConversation.id}-${index}`}>
                {message.from === 'them' && <span className={`message-avatar ${selectedConversation.color}`}>{selectedConversation.initials}</span>}
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span>{message.time} {message.from === 'me' && <Icon name="check" size={13} />}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="composer-disabled">
            <div className="composer-field"><span>Digite uma mensagem...</span><Icon name="send" size={18} /></div>
            <span>Envio de mensagens será habilitado quando um canal estiver conectado.</span>
          </div>
        </div>

        <aside className="contact-details">
          <div className="details-heading"><h2>Detalhes do contato</h2><button className="icon-button subtle-button" type="button" aria-label="Mais detalhes"><Icon name="dots" size={19} /></button></div>
          <div className="details-profile">
            <span className={`details-avatar ${selectedConversation.color}`}>{selectedConversation.initials}</span>
            <strong>{selectedConversation.name}</strong>
            <span>{selectedConversation.company}</span>
            <span className="contact-demo-label"><span /> Perfil de demonstração</span>
          </div>
          <div className="details-section">
            <div className="details-label">INFORMAÇÕES</div>
            <div className="detail-item"><span>Canal</span><strong><span className="whatsapp-mini">w</span> WhatsApp (demo)</strong></div>
            <div className="detail-item"><span>Status</span><strong><span className="status-dot" /> Em atendimento</strong></div>
            <div className="detail-item"><span>Responsável</span><strong><span className="assignee-avatar">AC</span> Ana Costa</strong></div>
          </div>
          <div className="details-section">
            <div className="details-label">OPORTUNIDADE</div>
            <div className="opportunity-card"><span><Icon name="briefcase" size={17} /> Cotação</span><strong>Em acompanhamento</strong><small>Informação ilustrativa</small></div>
          </div>
          <button className="details-action" type="button" disabled><Icon name="plus" size={15} /> Adicionar observação <span>Em breve</span></button>
        </aside>
      </section>
      <footer className="page-footer"><span>Prime CRM <span>•</span> Caixa de entrada</span><span>Dados fictícios para demonstração</span></footer>
    </>
  );
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <div className="main-column">
        <Header activeSection={activeSection} onNavigate={setActiveSection} />
        <main className={`main-content ${activeSection === 'inbox' ? 'inbox-content' : ''}`}>
          {activeSection === 'overview'
            ? <Overview onOpenInbox={() => setActiveSection('inbox')} />
            : <Inbox onBack={() => setActiveSection('overview')} />}
        </main>
      </div>
    </div>
  );
}
