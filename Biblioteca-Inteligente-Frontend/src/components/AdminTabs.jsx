import { Link, useLocation } from 'react-router-dom';
import '../styles/AdminPanel.css';

function IconBookTab(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true" focusable="false" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  );
}

function IconCalendarTab(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true" focusable="false" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

const TABS = [
  { to: '/admin', label: 'Libros', Icon: IconBookTab },
  { to: '/admin-turnos', label: 'Turnos', Icon: IconCalendarTab },
];

export default function AdminTabs() {
  const location = useLocation();
  const pathname = location?.pathname || '';

  return (
    <nav
      className="panel-admin-tabs admin-tabs"
      aria-label="Secciones de administración"
    >
      <div className="admin-tabs-list" role="tablist" aria-label="Admin">
        {TABS.map((tab) => {
          const active = pathname === tab.to;
          const TabIcon = tab.Icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              role="tab"
              aria-selected={active}
              aria-current={active ? 'page' : undefined}
              className={`panel-admin-tab-link admin-tab-link${active ? ' active' : ''}`}
              title={`Ir a ${tab.label}`}
            >
              <span className="admin-tab-icon" aria-hidden="true">
                <TabIcon />
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
