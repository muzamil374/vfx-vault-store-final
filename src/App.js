import React from 'react';
import { bundlesData } from './data/bundles';
import BundleCard from './components/BundleCard'; // Make sure this path is correct
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="header py-10 text-center">
        <h1 className="text-5xl font-black tracking-tighter">VFX VAULT</h1>
        <p className="mt-2" style={{ color: '#00FFC2', letterSpacing: '5px' }}>
          PREMIUM 4K ASSETS • STARTS AT ₹69
        </p>
      </div>

      {/* BUNDLE GRID */}
      <div className="bundle-grid max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bundlesData.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>

      {/* FOOTER MESSAGE */}
      <div className="text-center py-20 opacity-50 text-xs italic">
        <p>After payment, please email your screenshot to support@vfxvault.com</p>
        <p>© 2026 VFX VAULT DIGITAL ASSETS</p>
      </div>
    </div>
  );
}

export default App;