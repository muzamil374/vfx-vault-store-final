import React, { useState } from 'react';

const BundleCard = ({ bundle }) => {
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = () => {
    // Razorpay Integration Logic
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Secure Key from Razorpay Dashboard
      amount: bundle.price * 100, // Amount in paise (6900)
      currency: "INR",
      name: "VFX ELITE STORE",
      description: `Purchase ${bundle.name}`,
      handler: function (response) {
        if(response.razorpay_payment_id) {
          setIsPaid(true); // UNLOCKS THE DOWNLOAD BUTTON
          alert("Payment Successful! Your download is now active.");
        }
      },
      theme: { color: "#00FFC2" } // Your Brand Mint Green
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="relative group perspective-1000">
      {/* 3D Panel Effect */}
      <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-4 transition-all duration-500 transform group-hover:rotate-y-12 group-hover:scale-105 shadow-2xl">
        <img src={bundle.thumbnail} alt={bundle.name} className="rounded-xl w-full h-48 object-cover mb-4" />
        
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">{bundle.name}</h3>
        <p className="text-gray-400 text-sm mb-4">4K AI-Generated • 4 Clips Included</p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-emerald-400">₹{bundle.price}</span>
          
          {!isPaid ? (
            <button 
              onClick={handlePayment}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-lg transition-transform active:scale-95"
            >
              BUY NOW
            </button>
          ) : (
            <a 
              href={bundle.file} 
              download 
              className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg animate-bounce"
            >
              DOWNLOAD ZIP
            </a>
          )}
        </div>
      </div>
    </div>
  );
};