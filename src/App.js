import React, { useState } from 'react';
import { bundlesData } from './data/bundles';
import './index.css';

function App() {
  const [purchased, setPurchased] = useState([]);

  const handlePayment = (bundleId) => {
    const options = {
      key: "rzp_test_SbpheomcLbeylh", // Put your rzp_live_ or rzp_test_ key here
      amount: 6900,
      currency: "INR",
      name: "VFX VAULT",
      description: "Instant Unlock",
      // Skipping user details entry
      prefill: { contact: "9999999999", email: "customer@vfxvault.com" },
      config: {
        display: {
          blocks: {
            banks: { name: 'UPI / QR CODE', instruments: [{ method: 'upi' }] },
          },
          sequence: ['block.banks'],
        },
      },
      handler: function (response) {
        if (response.razorpay_payment_id) {
          setPurchased([...purchased, bundleId]);
        }
      },
      theme: { color: "#00FFC2" }
    };
    new window.Razorpay(options).open();
  };

  return (
    <div>
      <div className="header">
        <h1>VFX VAULT</h1>
        <p style={{ color: '#00FFC2', letterSpacing: '5px' }}>PREMIUM 4K ASSETS • ₹69 ONLY</p>
      </div>

      <div className="bundle-grid">
        {bundlesData.map((bundle) => (
          <div key={bundle.id} className="card">
            <img src={`/thumbnails/${bundle.thumb}`} alt={bundle.name} />
            <h2 style={{ fontSize: '18px', margin: '10px 0' }}>{bundle.name}</h2>
            
            <div className="price-row">
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#00FFC2' }}>₹69</span>
              
              {purchased.includes(bundle.id) ? (
                <a href={`/bundles/${bundle.zip}`} download className="download-btn">DOWNLOAD</a>
              ) : (
                <button onClick={() => handlePayment(bundle.id)} className="buy-btn">BUY NOW</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;