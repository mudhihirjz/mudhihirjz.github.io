import React from 'react';
import { Monitor, FileText, Mail, Lightbulb, Rocket } from 'lucide-react';

const accessCards = [
  { icon: <Monitor size={24} />, title: 'My Projects', desc: 'View my work & ideas' },
  { icon: <FileText size={24} />, title: 'Resume', desc: 'Download PDF' },
  { icon: <Mail size={24} />, title: 'Contact Me', desc: "Let's work together" },
  { icon: <Lightbulb size={24} />, title: 'Ideas', desc: 'Random thoughts & concepts' },
];

export default function QuickAccess() {
  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
        <span className="glass-pill active" style={{ padding: '8px 24px', fontSize: '14px' }}>⚡ Quick Access</span>
        <span className="glass-pill" style={{ padding: '8px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>Latest Updates</span>
        <span className="glass-pill" style={{ padding: '8px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>Social Links</span>
        <span className="glass-pill" style={{ padding: '8px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>Download</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {accessCards.map((card, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }}>{card.icon}</div>
            <h4 style={{ margin: '0 0 8px 0' }}>{card.title}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{card.desc}</p>
          </div>
        ))}
        
        {/* Quote Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(45,122,245,0.1), rgba(138,43,226,0.1))', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Rocket size={24} color="var(--accent-blue)" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.4', margin: '0 0 8px 0' }}>
            Small steps every day lead to big results.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>— MJz Tech</p>
        </div>
      </div>
    </div>
  );
}