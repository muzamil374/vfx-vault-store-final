import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleUPILink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bundle.upiLink) {
      window.location.href = bundle.upiLink;
    }
  };

  return (
    <div className="bundle-card-wrapper" style={{ padding: '10px' }}>
      <div 
        className="main-card" 
        style={{
          background: '#111',
          border: '1px solid #333',
          borderRadius: '20px',
          padding: '15px',
          position: 'relative',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        {/* PREVIEW TOGGLE */}
        {bundle.clip && (
          <button 
            onClick={(e) => { e.stopPropagation(); setShowPreview(!showPreview); }}
            style={{
              position: 'absolute',
              top: '25px',
              right: '25px',
              zIndex: 100,
              background: showPreview ? '#ff4d4d' : '#00FFC2',
              color: '#000',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '30px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(0,255,194,0.3)'
            }}
          >
            {showPreview ? "✕ CLOSE" : "▶ PREVIEW"}
          </button>
        )}

        {/* IMAGE / VIDEO AREA */}
        <div style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>

        {/* INFO AREA */}
        <div style={{ marginTop: '15px' }}>
          <h3 style={{ color: '#fff', fontSize: '16px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            {bundle.name}
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#00FFC2', fontSize: '24px', fontWeight: '900' }}>
              ₹{bundle.price}
            </span>
            <button 
              onClick={handleUPILink}
              style={{
                background: '#00FFC2',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '12px'
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