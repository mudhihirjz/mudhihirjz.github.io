import React, { useState } from 'react';
import { Menu, Search, MoreHorizontal, X } from 'lucide-react';

const navItems = ['Home', 'About', 'Services', 'Projects', 'Skills', 'Contact'];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  return (
    <header className="glass-panel" style={{
      position: 'sticky', top: '16px', zIndex: 100, margin: '16px auto',
      width: '100%', padding: '12px 24px',
      display: 'flex', flexDirection: 'column', gap: isMobileMenuOpen ? '16px' : '0px',
      borderBottom: '1px solid rgba(45, 122, 245, 0.3)',
      transition: 'all 0.3s ease'
    }}>
      {/* Top Row */}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>🦩</div>
          <div>
            <h1 style={{ fontSize: '18px', margin: 0 }}>MJz Tech</h1>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>Ideas • Digital • Impact</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`glass-pill ${activeNav === item ? 'active' : ''}`}
              style={{ padding: '8px 16px', color: 'var(--text-main)', fontSize: '14px', cursor: 'pointer', border: 'none', background: activeNav === item ? '' : 'transparent' }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="glass-pill" style={{ padding: '10px', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Search"><Search size={18} /></button>
          <button className="glass-pill mobile-hide" style={{ padding: '10px', border: 'none', color: 'white', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }} aria-label="More"><MoreHorizontal size={18} /></button>
          <button
            className="glass-pill mobile-menu-btn"
            style={{ padding: '10px', border: 'none', color: 'white', display: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', paddingBottom: '8px' }} className="mobile-show">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                setIsMobileMenuOpen(false);
              }}
              className={`glass-pill ${activeNav === item ? 'active' : ''}`}
              style={{
                padding: '12px 20px', color: 'var(--text-main)', fontSize: '15px',
                cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
                background: activeNav === item ? '' : 'rgba(255,255,255,0.02)'
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}