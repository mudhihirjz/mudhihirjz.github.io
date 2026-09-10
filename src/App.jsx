import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedBook from './components/FeaturedBook';
import QuickAccess from './components/QuickAccess';
import Footer from './components/Footer';

const mainTabs = ['Featured', 'Education', 'Technology', 'Lifestyle', 'Gallery', 'More'];

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState('Featured');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  return (
    <div className="app-container">
      <Header />
      
      <Hero />

      {/* Main Tabs Section */}
      <div className="glass-panel" style={{ padding: isMobile ? '20px 16px' : '32px' }}>
        {/* Main Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch'
        }}>
          {mainTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={`glass-pill ${activeMainTab === tab ? 'active' : ''}`}
              style={{ 
                padding: isMobile ? '8px 20px' : '10px 28px',
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
                background: activeMainTab === tab ? '' : 'transparent',
                color: 'white',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div style={{ minHeight: isMobile ? '350px' : '500px' }}>
          {activeMainTab === 'Featured' && <FeaturedBook />}
          {activeMainTab === 'Education' && <div style={{ color: 'white', padding: '40px 20px', textAlign: 'center', fontSize: '15px' }}>Education Content Here (Map over education data array)</div>}
          {activeMainTab === 'Technology' && <div style={{ color: 'white', padding: '40px 20px', textAlign: 'center', fontSize: '15px' }}>Technology Skills Matrix Here</div>}
          {activeMainTab === 'Lifestyle' && <div style={{ color: 'white', padding: '40px 20px', textAlign: 'center', fontSize: '15px' }}>Lifestyle Cards Here</div>}
          {activeMainTab === 'Gallery' && <div style={{ color: 'white', padding: '40px 20px', textAlign: 'center', fontSize: '15px' }}>Gallery Grid with Lightbox Modal</div>}
          {activeMainTab === 'More' && <div style={{ color: 'white', padding: '40px 20px', textAlign: 'center', fontSize: '15px' }}>Vision, Achievements, Downloads</div>}
        </div>
      </div>

      <QuickAccess />
      <Footer />
    </div>
  );
}