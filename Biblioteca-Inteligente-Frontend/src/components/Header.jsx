import '../styles/Header.css';

export default function Header({ right }) {
  return (
    <header className="panel-navbar">
      <div className="panel-logo">
        <span>
          BIBLIOTECA<br />INTELIGENTE
        </span>
        <span className="panel-libro-icon" role="img" aria-label="libro">📚</span>
      </div>
      <div className="panel-navbar-right">
        {right}
      </div>
    </header>
  );
}