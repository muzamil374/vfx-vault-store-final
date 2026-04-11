import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [viewDetails, setViewDetails] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // This will stay false until you manually verify

  const handleUPILink = () => {
    window.location.href = bundle.upiLink;
  };

  // 1. GRID VIEW (What people see first)
  if (!viewDetails) {
    return (
      <div className="bg-gray-900 p-4 rounded-2xl border border-emerald-500/30 shadow-xl">
        <img src={`/thumbnails/${bundle.thumb}`} className="rounded-xl w-full h-48 object-cover mb-4 grayscale hover:grayscale-0 transition-all" />
        <h3 className="text-white font-bold uppercase">{bundle.name}</h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-emerald-400 font-black">₹{bundle.price}</span>
          <button 
            onClick={() => setViewDetails(true)} 
            className="bg-emerald-500 text-black px-4 py-2 rounded-lg font-bold text-xs"
          >
            ENTER BUNDLE
          </button>
        </div>
      </div>
    );
  }

  // 2. INSIDE BUNDLE VIEW (The "Locked" Room)
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
      <div className="max-w-4xl w-full bg-gray-900 rounded-3xl p-8 border border-emerald-500/50 relative">
        <button onClick={() => setViewDetails(false)} className="absolute top-6 right-6 text-white text-2xl">✕</button>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT SIDE: THE LOCKED MEDIA */}
          <div className="bg-black rounded-2xl aspect-video flex items-center justify-center border-2 border-dashed border-gray-700 relative overflow-hidden">
             {!isPaid ? (
               <div className="text-center p-6">
                 <div className="text-5xl mb-4">🔒</div>
                 <p className="text-gray-500 text-sm uppercase tracking-widest">Preview Locked</p>
                 <p className="text-[10px] text-gray-600 mt-2">Complete payment to unlock high-quality clips</p>
               </div>
             ) : (
               <video 
                 src={`/clips/${bundle.clip}`} 
                 controls 
                 controlsList="nodownload" 
                 onContextMenu={(e) => e.preventDefault()}
                 className="w-full h-full object-contain"
               />
             )}
          </div>

          {/* RIGHT SIDE: THE PAYMENT BOX */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-black text-white mb-2">{bundle.name}</h2>
            <p className="text-gray-400 mb-6 text-sm">This bundle contains 4 cinematic 4K VFX clips. Once paid, the video player above and the download link will unlock.</p>
            
            <div className="bg-black/50 p-6 rounded-2xl border border-emerald-500/20 mb-6">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-gray-400">Total Price:</span>
                 <span className="text-3xl font-black text-emerald-400">₹{bundle.price}</span>
               </div>
               <button onClick={handleUPILink} className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl hover:scale-105 transition-transform">
                 PAY VIA GPAY / UPI
               </button>
            </div>

            <p className="text-[10px] text-gray-500 italic text-center">
              Note: After payment, send screenshot to [Your Email]. <br/>
              We will provide you the unique unlock key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;