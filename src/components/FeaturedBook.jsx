import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Code, Users, TrendingUp, Cpu, Globe, Award, ShieldCheck } from 'lucide-react';

const bookItems = [
  {
    id: 1,
    category: 'TECH & DEVELOPMENT',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    title: 'Learning & Building',
    description: 'From HTML/CSS to React and beyond. Every line of code is a step towards a bigger dream.',
    quote: '"Mabadiliko makubwa huanza na hatua ndogo."',
    items: [
      { icon: <BookOpen size={16} />, title: 'Learn Everyday', desc: 'New skills, better tomorrow' },
      { icon: <Code size={16} />, title: 'Build Projects', desc: 'Turn ideas into reality' },
      { icon: <Users size={16} />, title: 'Help Others', desc: 'Share knowledge, create impact' },
      { icon: <TrendingUp size={16} />, title: 'Keep Growing', desc: 'Better version of myself' },
    ]
  },
  {
    id: 2,
    category: 'SOFTWARE ENGINEERING',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    title: 'Systems & Architecture',
    description: 'Designing reliable digital infrastructure, studying backend logics, database integration, and high performance apps.',
    quote: '"Technology is best when it brings people together."',
    items: [
      { icon: <Cpu size={16} />, title: 'Core Logics', desc: 'Mastering C++ & modern JS frameworks' },
      { icon: <Globe size={16} />, title: 'Web Scalability', desc: 'Responsive web engineering apps' },
      { icon: <Award size={16} />, title: 'Clean Architecture', desc: 'Writing maintainable production code' },
      { icon: <ShieldCheck size={16} />, title: 'Security Mindset', desc: 'Data protection and secure routing' },
    ]
  }
];

export default function FeaturedBook() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleNext = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % bookItems.length);
      setIsFlipping(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + bookItems.length) % bookItems.length);
      setIsFlipping(false);
    }, 300);
  };

  const item = bookItems[currentIndex];

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: isMobile ? '20px 0' : '40px 0',
      perspective: '1500px',
      width: '100%'
    }}>
      
      {/* Book Container with Arrows integrated responsively */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        gap: isMobile ? '8px' : '24px'
      }}>
        
        {/* Left Arrow */}
        {!isMobile && (
          <button onClick={handlePrev} className="glass-pill" style={{ padding: '14px', cursor: 'pointer', border: 'none', color: 'white', flexShrink: 0 }}>
            <ChevronLeft size={22} />
          </button>
        )}

        {/* The Book Itself */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: '100%',
          maxWidth: isMobile ? '100%' : '800px',
          minHeight: isMobile ? 'auto' : '450px',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isFlipping ? 'rotateY(15deg)' : 'rotateY(0deg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>

          {/* Left Page */}
          <div style={{
            flex: 1, background: 'white',
            padding: isMobile ? '24px' : '30px',
            display: 'flex', flexDirection: 'column', gap: '14px',
            color: '#333', position: 'relative'
          }}>
            <span style={{ background: 'var(--accent-blue)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', width: 'fit-content' }}>
              {item.category}
            </span>
            <img src={item.image} alt={item.title} style={{ width: '100%', height: isMobile ? '160px' : '180px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3 style={{ fontSize: '20px', margin: 0, color: '#1a202c' }}>{item.title}</h3>
            <p style={{ fontSize: '13px', color: '#4a5568', lineHeight: '1.5' }}>{item.description}</p>
            <a href={`https://wa.me/255671533265?text=Hello%20Mudhihiri,%20I%20am%20interested%20in%20your%20${item.title}%20learnings.`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold', marginTop: isMobile ? '12px' : 'auto' }}>Connect for Details →</a>

            {!isMobile && (
              <div style={{ position: 'absolute', right: 0, top: 0, width: '20px', height: '100%', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.08))' }}></div>
            )}
          </div>

          {/* Right Page */}
          <div style={{
            flex: 1, background: '#f4f6fb',
            padding: isMobile ? '24px' : '30px',
            display: 'flex', flexDirection: 'column', gap: '20px',
            color: '#333', position: 'relative'
          }}>
            <div style={{ fontSize: '32px', color: 'var(--accent-blue)', fontFamily: 'Georgia, serif', lineHeight: '1' }}>“</div>
            <p style={{ fontSize: '16px', fontWeight: 'bold', fontStyle: 'italic', color: '#1a202c', marginTop: '-10px' }}>{item.quote}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {item.items.map((subItem, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: idx % 2 === 0 ? 'rgba(45,122,245,0.1)' : 'rgba(138,43,226,0.1)', padding: '8px', borderRadius: '8px', color: idx % 2 === 0 ? 'var(--accent-blue)' : 'var(--accent-purple)', flexShrink: 0 }}>
                    {subItem.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13px', color: '#2d3748' }}>{subItem.title}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#718096' }}>{subItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {!isMobile && (
              <div style={{ position: 'absolute', left: 0, top: 0, width: '20px', height: '100%', background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.04))' }}></div>
            )}
          </div>

        </div>

        {/* Right Arrow */}
        {!isMobile && (
          <button onClick={handleNext} className="glass-pill" style={{ padding: '14px', cursor: 'pointer', border: 'none', color: 'white', flexShrink: 0 }}>
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Floating Controls for Mobile View */}
      {isMobile && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
          <button onClick={handlePrev} className="glass-pill" style={{ padding: '10px 20px', cursor: 'pointer', border: 'none', color: 'white', fontSize: '14px' }}>
            ← Previous Book
          </button>
          <button onClick={handleNext} className="glass-pill" style={{ padding: '10px 20px', cursor: 'pointer', border: 'none', color: 'white', fontSize: '14px' }}>
            Next Book →
          </button>
        </div>
      )}
    </div>
  );
}