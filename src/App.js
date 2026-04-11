import React from 'react';
import { bundlesData } from './data/bundles';
import BundleCard from './components/BundleCard';
import './index.css';

function App() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingBottom: '50px' }}>
      <header style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ color: '#fff', fontSize: '4rem', fontWeight: '900', margin: 0 }}>VFX VAULT</h1>
        <p style={{ color: '#00FFC2', letterSpacing: '8px', fontSize: '12px', marginTop: '10px' }}>
          PREMIUM 4K ASSETS • STARTS AT ₹69
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px', 
        maxWidth: '1300px', 
        margin: '0 auto', 
        padding: '0 20px' 
      }}>
        {bundlesData.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}

export default App;