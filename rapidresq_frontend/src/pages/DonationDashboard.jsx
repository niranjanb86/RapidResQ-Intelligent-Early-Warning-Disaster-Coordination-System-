import React, { useState } from 'react';
import { Heart, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';

const DonationDashboard = () => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const predefinedAmounts = [500, 1000, 2500, 5000];

  const handleDonate = (e) => {
    e.preventDefault();
    const finalAmount = amount === 'custom' ? customAmount : amount;
    
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-slate-800 rounded-2xl shadow-lg border border-slate-700 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Thank you for your generosity!</h2>
        <p className="text-lg text-slate-400 mb-8">
          Your donation of ₹{amount === 'custom' ? customAmount : amount} has been successfully processed. The funds will be transferred to the authorized disaster relief authorities immediately.
        </p>
        <button 
          onClick={() => { setIsSuccess(false); setAmount(''); setCustomAmount(''); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Left Info Panel */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3" /> Relief Fund Donation
          </h2>
          <p className="text-slate-400 mt-3">
            Your contributions directly support affected citizens, helping us provide food, shelter, and medical supplies during major emergencies.
          </p>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 p-5 rounded-lg space-y-3 shadow-sm">
          <h4 className="font-bold text-blue-200 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" /> Authorized Receiver
          </h4>
          <p className="text-sm text-blue-300">
            All transactions are routed directly to the Chief Minister's Distress Relief Fund (CMDRF) and verified local disaster management authorities.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-700">
        <form onSubmit={handleDonate} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3">Select Amount (₹)</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {predefinedAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setAmount(amt); setCustomAmount(''); }}
                  className={`py-3 rounded-lg border-2 font-bold transition-colors ${
                    amount === amt 
                      ? 'border-blue-600 bg-blue-900/30 text-blue-400' 
                      : 'border-slate-700 text-slate-400 hover:border-blue-600 hover:bg-slate-900'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
              <input 
                type="number" 
                placeholder="Other Amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('custom');
                }}
                className={`w-full pl-8 p-3 border-2 rounded-lg focus:outline-none transition ${
                  amount === 'custom' ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-700 focus:border-blue-400'
                }`}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3">Payment Method</label>
            <div className="flex space-x-4">
              <label className={`flex-1 flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'bg-slate-900/30 border-slate-900' : ''}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-3" />
                <CreditCard className="w-5 h-5 text-slate-300 mr-2" /> Credit/Debit Card
              </label>
              <label className={`flex-1 flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'upi' ? 'bg-slate-900/30 border-slate-900' : ''}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-3" />
                <span className="font-bold text-slate-300 tracking-wider">UPI</span>
              </label>
            </div>
          </div>

          {/* Mock Card Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-3 bg-slate-900 p-4 rounded-lg border border-slate-700">
              <input type="text" placeholder="Card Number" className="w-full border border-slate-600 rounded p-2 text-sm" />
              <div className="flex space-x-3">
                <input type="text" placeholder="MM/YY" className="w-1/2 border border-slate-600 rounded p-2 text-sm" />
                <input type="text" placeholder="CVV" className="w-1/2 border border-slate-600 rounded p-2 text-sm" />
              </div>
              <input type="text" placeholder="Name on Card" className="w-full border border-slate-600 rounded p-2 text-sm" />
            </div>
          )}

          {/* Mock UPI Form */}
          {paymentMethod === 'upi' && (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <input type="text" placeholder="Enter UPI ID (e.g., name@bank)" className="w-full border border-slate-600 rounded p-2 text-sm" />
            </div>
          )}

          <button 
            type="submit"
            disabled={isProcessing || (!amount && !customAmount)}
            className={`w-full py-4 text-white font-bold rounded-lg shadow-md transition flex justify-center items-center ${
              isProcessing || (!amount && !customAmount) ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
              </span>
            ) : (
              `Donate ₹${amount === 'custom' ? customAmount || '0' : amount || '0'}`
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default DonationDashboard;
