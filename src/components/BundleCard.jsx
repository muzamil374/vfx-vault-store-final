import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleUPILink = (e) => {
    e.stopPropagation(); // Prevents click from triggering other things
    if (bundle.upiLink) {
      window.location.href = bundle.upiLink;
    } else {
      alert("Payment link is being updated!");
    }
  };

  const togglePreview = (e) => {
    e.stopPropagation();
    setShowPreview(!showPreview);
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      
      {/* PREVIEW BUTTON - Placed strictly on top */}
      {bundle.clip && (
        <button 
          onClick={togglePreview}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            zIndex: 50,
            background: 'rgba(0,0,0,0.8)',
            color: '#00FFC2',
            border: '1px solid #00FFC2',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showPreview ? "✕ CLOSE" : "▶ PREVIEW"}
        </button>
      )}

      {/* MEDIA AREA */}
      <div className="media-container" style={{ height: '200px', overflow: 'hidden', borderRadius: '10px', background: '#000' }}>
        {showPreview ? (
          <video 
            src={`/clips/${bundle.clip}`} 
            autoPlay muted loop playsInline
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            style={{ width: '100%', height: '100%', objectCover: 'cover' }}
          />
        ) : (
          <img 
            src={`/thumbnails/${bundle.thumb}`} 
            alt={bundle.name} 
            style={{ width: '100%', height: '100%', objectCover: 'cover' }}
          />
        )}
      </div>
      
      <h2 style={{ fontSize: '16px', margin: '15px 0', color: '#fff' }}>{bundle.name}</h2>
      
      <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '22px', fontWeight: '900', color: '#00FFC2' }}>₹{bundle.price}</span>
        <button onClick={handleUPILink} className="buy-btn">BUY NOW</button>
      </div>
    </div>
  );
};

export default BundleCard;