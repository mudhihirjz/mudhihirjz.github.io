import React, { useState } from 'react';
import { Menu, Search, MoreHorizontal, X } from 'lucide-react';

const navItems = ['Home', 'About', 'Services', 'Projects', 'Skills', 'Contact'];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching portfolio for: "${searchQuery}"`);
      // Future expansion: hook this query state up to a central filtering service
    }
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky', top: '16px', zIndex: 100, margin: '16px auto',
      width: '100%', padding: '12px 24px',
      display: 'flex', flexDirection: 'column', gap: isMobileMenuOpen || isSearchActive ? '16px' : '0px',
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

        {/* Desktop Nav with Compact Word-length Padding */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`glass-pill ${activeNav === item ? 'active' : ''}`}
              style={{
                padding: '6px 12px', // Shrunk width to fit exactly word length
                color: 'var(--text-main)',
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
                background: activeNav === item ? '' : 'transparent'
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={`glass-pill ${isSearchActive ? 'active' : ''}`}
            style={{ padding: '10px', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsSearchActive(!isSearchActive)}
            aria-label="Toggle Search Bar"
          >
            <Search size={18} />
          </button>
          <button className="glass-pill mobile-hide" style={{ padding: '10px', border: 'none', color: 'white', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }} aria-label="More Options"><MoreHorizontal size={18} /></button>
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

      {/* Interactive Search Bar Section */}
      {isSearchActive && (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search projects, skills, or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: '20px',
              padding: '8px 16px',
              color: 'white',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button type="submit" className="glass-pill" style={{ padding: '8px 16px', border: 'none', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
            Go
          </button>
        </form>
      )}

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
                padding: '10px 16px', color: 'var(--text-main)', fontSize: '14px',
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