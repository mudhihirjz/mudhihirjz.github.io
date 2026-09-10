import React from 'react';
import { MessageCircle, Github, Youtube, Instagram, X } from 'lucide-react';

export default function Footer() {
  const socials = [
    { icon: <MessageCircle size={18} />, label: 'WhatsApp' },
    { icon: <Github size={18} />, label: 'GitHub' },
    { icon: <Youtube size={18} />, label: 'YouTube' },
    { icon: <Instagram size={18} />, label: 'Instagram' },
    { icon: <X size={18} />, label: 'X/Twitter' },
  ];

  return (
    <footer className="glass-panel" style={{ padding: '32px 24px', marginTop: '20px' }}>
      {/* Top section: Brand, Links, Socials */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Brand */}
        <div style={{ minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '24px' }}>🦩</span>
            <h2 style={{ fontSize: '20px', margin: 0 }}>MJz Tech</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '1px' }}>Ideas • Digital • Impact</p>
        </div>

        {/* Links Navigation */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['Home', 'About', 'Services', 'Projects', 'Skills', 'Contact'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {socials.map((social, idx) => (
            <button
              key={idx}
              className="glass-pill"
              style={{ padding: '10px', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label={social.label}
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom section: Legal & Signature info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>© 2026 MJz Tech. All rights reserved.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: 0 }}>Built with ❤️ in Tanzania 🇹🇿</p>
        <p className="handwritten" style={{ margin: 0, fontSize: '18px' }}>Tech for a better tomorrow</p>
      </div>
    </footer>
  );
}