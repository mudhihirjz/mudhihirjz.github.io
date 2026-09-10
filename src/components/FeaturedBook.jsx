import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Code, Users, TrendingUp } from 'lucide-react';

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
  }
];

export default function FeaturedBook() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

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
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0', perspective: '1500px' }}>
      
      {/* Left Arrow */}
      <button onClick={handlePrev} className="glass-pill" style={{ position: 'absolute', left: '0', zIndex: 10, padding: '16px', cursor: 'pointer', border: 'none', color: 'white' }}>
        <ChevronLeft size={24} />
      </button>

      {/* Book Container */}
      <div style={{
        display: 'flex',
        width: '800px',
        height: '450px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isFlipping ? 'rotateY(10deg)' : 'rotateY(0deg)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        
        {/* Left Page */}
        <div style={{
          flex: 1, background: 'white', borderRadius: '10px 0 0 10px',
          padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px',
          color: '#333', position: 'relative', overflow: 'hidden'
        }}>
          <span style={{ background: 'var(--accent-blue)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', width: 'fit-content' }}>
            {item.category}
          </span>
          <img src={item.image} alt="Coding" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
          <h3 style={{ fontSize: '22px', margin: 0 }}>{item.title}</h3>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{item.description}</p>
          <a href="#" style={{ color: 'var(--accent-blue)', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold', marginTop: 'auto' }}>Read More →</a>
          
          {/* Spine shadow */}
          <div style={{ position: 'absolute', right: 0, top: 0, width: '20px', height: '100%', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))' }}></div>
        </div>

        {/* Right Page */}
        <div style={{
          flex: 1, background: '#f4f6fb', borderRadius: '0 10px 10px 0',
          padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px',
          color: '#333', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ fontSize: '40px', color: 'var(--accent-blue)', fontFamily: 'Georgia, serif', lineHeight: '1' }}>“</div>
          <p style={{ fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic', color: '#1a202c' }}>{item.quote}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            {item.items.map((subItem, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: idx % 2 === 0 ? 'rgba(45,122,245,0.1)' : 'rgba(138,43,226,0.1)', padding: '8px', borderRadius: '8px', color: idx % 2 === 0 ? 'var(--accent-blue)' : 'var(--accent-purple)' }}>
                  {subItem.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>{subItem.title}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{subItem.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Spine shadow */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '20px', height: '100%', background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.05))' }}></div>
        </div>

      </div>

      {/* Right Arrow */}
      <button onClick={handleNext} className="glass-pill" style={{ position: 'absolute', right: '0', zIndex: 10, padding: '16px', cursor: 'pointer', border: 'none', color: 'white' }}>
        <ChevronRight size={24} />
      </button>
    </div>
  );
}