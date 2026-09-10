import React from 'react';
import { MapPin, GraduationCap, Code2 } from 'lucide-react';

const chips = [
  { icon: <MapPin size={14} />, text: 'Tanzania' },
  { icon: <GraduationCap size={14} />, text: 'Student' },
  { icon: <Code2 size={14} />, text: 'HTML • CSS • JS • C++' }
];

export default function Hero() {
  return (
    <section style={{ position: 'relative', display: 'flex', gap: '0', marginTop: '20px', minHeight: '400px' }}>
      
      {/* Left: Profile Image */}
      <div style={{ 
        position: 'relative', zIndex: 2, width: '40%', 
        borderRadius: '40px 0 0 40px', overflow: 'hidden',
        boxShadow: 'var(--glow-blue)'
      }}>
        <img 
          src="/images/profile.jpg" 
          alt="Mudhihiri Selemani" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800/0d132b/2d7af5?text=Profile+Image'; }}
        />
        {/* Decorative glows */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'var(--accent-purple)', filter: 'blur(60px)', opacity: 0.6 }}></div>
      </div>

      {/* Right: Cloud Panel */}
      <div className="glass-panel" style={{ 
        flex: 1, position: 'relative', zIndex: 1, marginLeft: '-40px', 
        padding: '60px 40px 40px 80px',
        borderRadius: '60px 40px 40px 100px / 40px 100px 40px 60px',
        background: 'linear-gradient(135deg, rgba(13,19,43,0.9), rgba(6,8,20,0.95))',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        <p style={{ color: 'var(--accent-cyan)', fontSize: '18px', marginBottom: '8px' }}>Hello, I'm</p>
        <h1 style={{ fontSize: '48px', marginBottom: '8px' }} className="text-gradient">Mudhihiri Selemani</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '2px', marginBottom: '24px' }}>
          WEB DEVELOPER | TECH ENTHUSIAST | PROBLEM SOLVER
        </p>
        
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', marginBottom: '32px' }}>
          Napenda teknolojia, kujenga mifumo na kutatua matatizo kwa njia za ubunifu. 
          Lengo langu ni kujenga maboresho ya kisaolojia kupitia teknolojia.
        </p>

        {/* Chips */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {chips.map((chip, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '14px' }}>
              {chip.icon} {chip.text}
            </div>
          ))}
        </div>

        {/* Handwritten Text */}
        <div className="handwritten" style={{ position: 'absolute', right: '40px', top: '40px', fontSize: '28px', lineHeight: '1.2', textAlign: 'right', transform: 'rotate(-5deg)' }}>
          Dream<br/>Code<br/>Build<br/>Impact
        </div>
      </div>
    </section>
  );
}