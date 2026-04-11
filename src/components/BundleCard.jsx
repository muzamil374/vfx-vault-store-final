import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Only you (the Admin) will see clips by adding ?admin=true to the URL
  const isAdmin = typeof window !== 'undefined' && window.location.search.includes("admin=true");

  const handleUPILink = () => {
    if (bundle.upiLink) {
      window.location.href = bundle.upiLink;
    } else {
      alert("Payment link is being updated!");
    }
  };

  return (
    <div 
      className="relative group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-4 transition-all duration-500 transform group-hover:rotate-y-12 group-hover:scale-105 shadow-2xl">
        
        {/* VIDEO PROTECTION LOGIC */}
        <div className="relative rounded-xl overflow-hidden h-48 mb-4">
          {isAdmin && isHovered && bundle.clip ? (
            <video 
              src={`/clips/${bundle.clip}`} 
              autoPlay 
              muted 
              loop 
              playsInline
              controlsList="nodownload" // Disables the download button
              onContextMenu={(e) => e.preventDefault()} // Disables Right-Click
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

        <p className="text-[10px] text-gray-500 mt-3 text-center italic">
          *After GPay, email screenshot to download
        </p>
      </div>
    </div>
  );
};

export default BundleCard;