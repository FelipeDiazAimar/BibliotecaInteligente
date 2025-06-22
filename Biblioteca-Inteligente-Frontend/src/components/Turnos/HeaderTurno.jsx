import React from 'react';
import '../../styles/PanelUsuario.css';

export default function Header({ right }) {
  return (
    <header
      className="panel-navbar"
      style={{
        background: 'linear-gradient(90deg, #e3f2fd 60%, #bbdefb 100%)',
        boxShadow: '0 4px 24px #b3c6e022',
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        minHeight: 90,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1.2rem 3.5rem 1.2rem 2.2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        zIndex: 10
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24
      }}>
        <img
          src="/logo-utn-siglas.png"
          alt="UTN | Universidad Tecnológica Nacional - Facultad Regional San Francisco"
          style={{
            height: 100,
            width: 'auto',
            marginRight: 18,
            borderRadius: 10,
            boxShadow: '0 2px 8px #b3c6e033'
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {right}
      </div>
    </header>
  );
}