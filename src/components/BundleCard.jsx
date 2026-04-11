import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [showPreview, setShowPreview] = useState(false);

  // This function ensures the redirect happens even if the <a> tag is finicky
  const handleBuyClick = (e) => {
    if (!bundle.upiLink) {
      e.preventDefault();
      alert("Payment link is missing!");
    }
  };

  return (
    <div className="card-container" style={{ padding: '10px' }}>
      <div className="glass-card" style={{
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: '20px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.8)',
      }}>
        
        {/* MEDIA SECTION */}
        <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#000', position: 'relative' }}>
          {showPreview ? (
            <video 
              autoPlay muted loop playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              {/* UPDATED PATH: Pointing to /bundles/ as you described */}
              <source src={`/bundles/${bundle.clip}`} type="video/mp4" />
              Your browser does not support the video.
            </video>
          ) : (
            <img 
              src={`/thumbnails/${bundle.thumb}`} 
              alt={bundle.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>

        <h3 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>
          {bundle.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* PREVIEW BUTTON */}
          <button 
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#00FFC2',
              border: '1px solid #00FFC2',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {showPreview ? "✕ HIDE PREVIEW" : "▶ PREVIEW BUNDLE"}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#00FFC2', fontSize: '20px', fontWeight: '900' }}>₹{bundle.price}</span>
            
            {/* BUY NOW - Using a direct <a> tag for device compatibility */}
            <a 
              href={bundle.upiLink} 
              onClick={handleBuyClick}
              style={{
                background: '#00FFC2',
                color: '#000',
                textDecoration: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: '900',
                fontSize: '11px',
                textAlign: 'center',
                display: 'inline-block'
              }}
            >
              BUY NOW
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;