import React from 'react';
import { bundlesData } from './data/bundles';
import BundleCard from './components/BundleCard';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <div className="header">
        <h1>VFX VAULT</h1>
        <p style={{ color: '#00FFC2', letterSpacing: '5px' }}>
          PREMIUM 4K ASSETS • STARTS AT ₹69
        </p>
      </div>

      <div className="bundle-grid">
        {bundlesData.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}

export default App;