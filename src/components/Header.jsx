import React, { useState } from 'react';
import { Menu, Search, MoreHorizontal, X } from 'lucide-react';

const navItems = ['Home', 'About', 'Services', 'Projects', 'Skills', 'Contact'];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  return (
    <header className="glass-panel" style={{
      position: 'sticky', top: '16px', zIndex: 100, margin: '16px auto',
      maxWidth: '1400px', width: 'calc(100% - 32px)', padding: '12px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid rgba(45, 122, 245, 0.3)'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '24px' }}>🦩</div>
        <div>
          <h1 style={{ fontSize: '18px', margin: 0 }}>MJz Tech</h1>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>Ideas • Digital • Impact</p>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="desktop-nav">
        {navItems.map(item => (
          <button
            key={item}
            onClick={() => setActiveNav(item)}
            className={`glass-pill ${activeNav === item ? 'active' : ''}`}
            style={{ padding: '8px 20px', color: 'var(--text-main)', fontSize: '14px', cursor: 'pointer', border: 'none', background: activeNav === item ? '' : 'transparent' }}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right Actions */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button className="glass-pill" style={{ padding: '10px', border: 'none', color: 'white', cursor: 'pointer' }}><Search size={18} /></button>
        <button className="glass-pill" style={{ padding: '10px', border: 'none', color: 'white', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
        <button 
          className="glass-pill mobile-menu-btn" 
          style={{ padding: '10px', border: 'none', color: 'white', display: 'none', cursor: 'pointer' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  );
}