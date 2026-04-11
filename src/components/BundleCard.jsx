import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleUPILink = () => {
    if (bundle.upiLink) {
      window.location.href = bundle.upiLink;
    } else {
      alert("Payment link is being updated!");
    }
  };

  return (
    <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-4 shadow-2xl relative group">
      
      {/* 1. THE PREVIEW BUTTON (Top Right) */}
      {bundle.clip && (
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="absolute top-6 right-6 z-30 bg-black/80 hover:bg-emerald-500 hover:text-black text-emerald-400 px-3 py-1 rounded-full backdrop-blur-md transition-all border border-emerald-500/50 text-[10px] font-bold uppercase"
        >
          {showPreview ? "✕ Close" : "▶ Preview"}
        </button>
      )}

      {/* 2. MEDIA DISPLAY */}
      <div className="relative rounded-xl overflow-hidden h-48 mb-4 bg-black">
        {showPreview ? (
          <video 
            src={`/clips/${bundle.clip}`} 
            autoPlay 
            muted 
            loop 
            playsInline
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={`/thumbnails/${bundle.thumb}`} 
            alt={bundle.name} 
            className="w-full h-full object-cover" 
          />
        )}
      </div>
      
      {/* 3. BUNDLE INFO */}
      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-tight truncate">
        {bundle.name}
      </h3>
      
      <div className="flex justify-between items-center">
        <span className="text-xl font-black text-emerald-400">₹{bundle.price}</span>
        
        <button 
          onClick={handleUPILink}
          className="bg-[#00ffc2] hover:bg-[#00e6af] text-black font-bold py-1.5 px-5 rounded-lg text-xs transition-transform active:scale-95 uppercase"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default BundleCard;