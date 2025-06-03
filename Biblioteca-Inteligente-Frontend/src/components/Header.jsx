import '../styles/PanelUsuario.css';

export default function Header({ left, right }) {
  return (
    <header className="panel-navbar">
      <div>{left}</div>
      <div>{right}</div>
    </header>
  );
}