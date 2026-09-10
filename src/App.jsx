import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedBook from './components/FeaturedBook';
import QuickAccess from './components/QuickAccess';
import Footer from './components/Footer';

const mainTabs = ['Featured', 'Education', 'Technology', 'Lifestyle', 'Gallery', 'More'];

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState('Featured');

  return (
    <div className="app-container">
      <Header />
      
      <Hero />

      {/* Main Tabs Section */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
          {mainTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={`glass-pill ${activeMainTab === tab ? 'active' : ''}`}
              style={{ 
                padding: '10px 28px', fontSize: '14px', cursor: 'pointer', 
                border: 'none', background: activeMainTab === tab ? '' : 'transparent',
                color: 'white', whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '500px' }}>
          {activeMainTab === 'Featured' && <FeaturedBook />}
          {activeMainTab === 'Education' && <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Education Content Here (Map over education data array)</div>}
          {activeMainTab === 'Technology' && <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Technology Skills Matrix Here</div>}
          {activeMainTab === 'Lifestyle' && <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Lifestyle Cards Here</div>}
          {activeMainTab === 'Gallery' && <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Gallery Grid with Lightbox Modal</div>}
          {activeMainTab === 'More' && <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Vision, Achievements, Downloads</div>}
        </div>
      </div>

      <QuickAccess />
      <Footer />
    </div>
  );
}
