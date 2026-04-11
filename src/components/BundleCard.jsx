import React, { useState } from 'react';
import { Play, X } from 'lucide-react'; // Optional: Use an icon library or just text

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
    <div className="relative group perspective-1000">
      <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-4 transition-all duration-500 transform group-hover:scale-[1.02] shadow-2xl relative">
        
        {/* --- NEW PREVIEW BUTTON (TOP RIGHT) --- */}
        {bundle.clip && (
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="absolute top-6 right-6 z-10 bg-black/60 hover:bg-emerald-500 hover:text-black text-emerald-400 p-2 rounded-full backdrop-blur-md transition-all border border-emerald-500/50"
            title="Watch Preview"
          >
            {showPreview ? "✕ Close" : "▶ Preview"}
          </button>
        )}

        {/* MEDIA CONTAINER */}
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
        
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">
          {bundle.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4">4K AI-Generated • VFX Assets Included</p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-emerald-400">₹{bundle.price || 69}</span>
          
          <button 
            onClick={handleUPILink}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-lg transition-transform active:scale-95"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;