import React from 'react';

const BundleCard = ({ bundle }) => {
  // We remove the [isPaid] state for now because direct UPI 
  // cannot "talk" back to the website to unlock the button automatically.
  
  const handleUPILink = () => {
    // This opens GPay/PhonePe/Paytm directly on the user's phone
    if (bundle.upiLink) {
      window.location.href = bundle.upiLink;
    } else {
      alert("Payment link is being updated. Please try again later!");
    }
  };

  return (
    <div className="relative group perspective-1000">
      {/* 3D Panel Effect */}
      <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-4 transition-all duration-500 transform group-hover:rotate-y-12 group-hover:scale-105 shadow-2xl">
        
        {/* Use the 'thumb' property from your bundlesData */}
        <img 
          src={`/thumbnails/${bundle.thumb}`} 
          alt={bundle.name} 
          className="rounded-xl w-full h-48 object-cover mb-4" 
        />
        
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">
          {bundle.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4">4K AI-Generated • VFX Assets Included</p>
        
        <div className="flex justify-between items-center">
          {/* Use the 'price' property from your bundlesData */}
          <span className="text-2xl font-black text-emerald-400">₹{bundle.price || 69}</span>
          
          <button 
            onClick={handleUPILink}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-lg transition-transform active:scale-95"
          >
            BUY NOW
          </button>
        </div>

        {/* Note for the user since payment is manual for now */}
        <p className="text-[10px] text-gray-500 mt-3 text-center italic">
          *After GPay, email screenshot to download
        </p>
      </div>
    </div>
  );
};

export default BundleCard;