import React, { useState, useEffect } from 'react';
import { MapPin, GraduationCap, Code2 } from 'lucide-react';

const chips = [
  { icon: <MapPin size={14} />, text: 'Tanzania' },
  { icon: <GraduationCap size={14} />, text: 'Student' },
  { icon: <Code2 size={14} />, text: 'HTML • CSS • JS • C++' }
];

export default function Hero() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  return (
    <section style={{
      position: 'relative',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '16px' : '0',
      marginTop: '20px',
      minHeight: isMobile ? 'auto' : '400px'
    }}>
      
      {/* Left / Top: Profile Image */}
      <div style={{ 
        position: 'relative',
        zIndex: 2,
        width: isMobile ? '100%' : '35%',
        borderRadius: isMobile ? '24px' : '40px 0 0 40px',
        overflow: 'hidden',
        boxShadow: 'var(--glow-blue)',
        height: isMobile ? '280px' : 'auto',
        minHeight: isMobile ? '280px' : '400px'
      }}>
        <img 
          src="/images/profile.jpg" 
          alt="Mudhihiri Selemani" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'; }}
        />
        {/* Decorative glows */}
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'var(--accent-purple)', filter: 'blur(60px)', opacity: 0.6 }}></div>
      </div>

      {/* Right / Bottom: Content Panel */}
      <div className="glass-panel" style={{ 
        flex: 1,
        position: 'relative',
        zIndex: 1,
        marginLeft: isMobile ? '0' : '-30px',
        padding: isMobile ? '32px 24px' : '60px 40px 40px 70px',
        borderRadius: isMobile ? '24px' : '0 40px 40px 0',
        background: 'linear-gradient(135deg, rgba(13,19,43,0.9), rgba(6,8,20,0.95))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'var(--accent-cyan)', fontSize: isMobile ? '15px' : '18px', marginBottom: '8px' }}>Hello, I'm</p>
        <h1 style={{ fontSize: isMobile ? '32px' : '48px', marginBottom: '8px', lineHeight: '1.2' }} className="text-gradient">Mudhihiri Selemani</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: isMobile ? '11px' : '13px', letterSpacing: '2px', marginBottom: '20px' }}>
          WEB DEVELOPER | TECH ENTHUSIAST | PROBLEM SOLVER
        </p>
        
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', marginBottom: '24px', fontSize: isMobile ? '14px' : '16px' }}>
          Napenda teknolojia, kujenga mifumo na kutatua matatizo kwa njia za ubunifu. 
          Lengo langu ni kujenga maboresho ya kisaolojia kupitia teknolojia.
        </p>

        {/* Chips */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: isMobile ? '16px' : '0' }}>
          {chips.map((chip, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-cyan)',
              fontSize: '13px',
              background: 'rgba(255,255,255,0.03)',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {chip.icon} <span>{chip.text}</span>
            </div>
          ))}
        </div>

        {/* Handwritten Text */}
        {!isMobile && (
          <div className="handwritten" style={{ position: 'absolute', right: '40px', top: '40px', fontSize: '24px', lineHeight: '1.2', textAlign: 'right', transform: 'rotate(-5deg)' }}>
            Dream<br/>Code<br/>Build<br/>Impact
          </div>
        )}
      </div>
    </section>
  );
}