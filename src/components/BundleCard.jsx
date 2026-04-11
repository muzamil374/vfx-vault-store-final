import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={{ 
      background: '#0a0a0a', 
      border: '1px solid #222', 
      borderRadius: '20px', 
      padding: '15px', 
      color: '#fff',
      marginBottom: '20px'
    }}>
      {/* MEDIA SECTION */}
      <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
        {showPreview ? (
          <video 
            autoPlay muted loop playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            {/* THIS IS THE CRITICAL PATH FIX */}
            <source src={`/bundles/${bundle.clip}`} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={`/thumbnails/${bundle.thumb}`} 
            alt="thumb" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <h3 style={{ fontSize: '14px', margin: '15px 0' }}>{bundle.name}</h3>

      {/* INTERACTION SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* PREVIEW BUTTON */}
        <button 
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          style={{
            background: 'transparent',
            color: '#00FFC2',
            border: '1px solid #00FFC2',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showPreview ? "✕ CLOSE PREVIEW" : "▶ PREVIEW BUNDLE"}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#00FFC2', fontSize: '20px', fontWeight: 'bold' }}>₹{bundle.price}</span>
          
          {/* THE BUY NOW LINK - Using <a> tag is the ONLY way to guarantee interaction */}
          <a 
            href={bundle.upiLink}
            style={{
              background: '#00FFC2',
              color: '#000',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            BUY NOW
          </a>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;