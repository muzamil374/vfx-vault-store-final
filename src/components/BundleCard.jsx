import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePurchase = (e) => {
    // These lines are critical to stop the browser from ignoring the click
    e.preventDefault();
    
    if (bundle.upiLink) {
      // Direct location change is the most compatible way for GPay/PhonePe
      window.location.href = bundle.upiLink;
    } else {
      alert("Payment Link Error: Please check bundles.js");
    }
  };

  return (
    <div className="card-container" style={{ padding: '10px' }}>
      <div 
        className="glass-card" 
        style={{
          background: '#0a0a0a',
          border: '1px solid #1a1a1a',
          borderRadius: '20px',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.8)',
          textAlign: 'left'
        }}
      >
        {/* MEDIA SECTION */}
        <div style={{ 
          width: '100%', 
          height: '180px', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          background: '#000',
          position: 'relative'
        }}>
          {showPreview ? (
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              {/* Check: Is your folder 'public/clips' or 'public/videos'? */}
              <source src={`/clips/${bundle.clip}`} type="video/mp4" />
              <source src={`/clips/${bundle.clip.replace('.mp4', '.mov')}`} type="video/quicktime" />
            </video>
          ) : (
            <img 
              src={`/thumbnails/${bundle.thumb}`} 
              alt={bundle.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>

        {/* DETAILS */}
        <h3 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>
          {bundle.name}
        </h3>
        <p style={{ color: '#555', fontSize: '9px', margin: 0 }}>4K UNCOMPRESSED • PRO VFX</p>

        {/* INTERACTION AREA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            {showPreview ? "✕ HIDE PREVIEW" : "▶ PREVIEW BUNDLE"}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#00FFC2', fontSize: '20px', fontWeight: '900' }}>₹{bundle.price}</span>
            <button 
              type="button"
              onClick={handlePurchase}
              style={{
                background: '#00FFC2',
                color: '#000',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: '900',
                cursor: 'pointer',
                fontSize: '11px',
                zIndex: 10
              }}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;