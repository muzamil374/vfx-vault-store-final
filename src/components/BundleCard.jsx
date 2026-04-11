import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Improved Buy Now logic to ensure it fires
  const handlePurchase = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (bundle.upiLink) {
      // Using _blank to ensure the browser doesn't block the redirect
      window.open(bundle.upiLink, "_self");
    } else {
      alert("UPI Link missing for this bundle!");
    }
  };

  return (
    <div className="card-container" style={{ padding: '10px' }}>
      <div 
        className="glass-card" 
        style={{
          background: '#121212',
          border: '1px solid #222',
          borderRadius: '24px',
          padding: '20px',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >
        {/* MEDIA SECTION */}
        <div style={{ 
          width: '100%', 
          height: '200px', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          background: '#000',
          position: 'relative'
        }}>
          {showPreview ? (
            <video 
              src={`/clips/${bundle.clip}`} 
              autoPlay muted loop playsInline
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img 
              src={`/thumbnails/${bundle.thumb}`} 
              alt={bundle.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
            />
          )}
          
          {/* SECURE OVERLAY FOR VIDEO */}
          {showPreview && (
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px', 
              background: 'rgba(0,0,0,0.5)', 
              padding: '4px 8px', 
              borderRadius: '6px',
              fontSize: '8px',
              color: '#00FFC2',
              pointerEvents: 'none'
            }}>
              PREVIEW MODE
            </div>
          )}
        </div>

        {/* INFO SECTION */}
        <div>
          <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', margin: '0 0 5px 0' }}>
            {bundle.name}
          </h3>
          <p style={{ color: '#666', fontSize: '10px', margin: '0 0 15px 0' }}>4K UNCOMPRESSED • 4 CLIPS</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* ACTION 1: PREVIEW BUTTON */}
            <button 
              onClick={() => setShowPreview(!showPreview)}
              style={{
                width: '100%',
                background: showPreview ? '#333' : 'transparent',
                color: showPreview ? '#fff' : '#00FFC2',
                border: '1px solid #00FFC2',
                padding: '10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              {showPreview ? "✕ HIDE CLIPS" : "▶ PREVIEW BUNDLE"}
            </button>

            {/* ACTION 2: BUY NOW BUTTON */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
              <span style={{ color: '#00FFC2', fontSize: '22px', fontWeight: '900' }}>₹{bundle.price}</span>
              <button 
                onClick={handlePurchase}
                style={{
                  background: '#00FFC2',
                  color: '#000',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '12px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  fontSize: '12px',
                  boxShadow: '0 4px 15px rgba(0,255,194,0.3)'
                }}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;