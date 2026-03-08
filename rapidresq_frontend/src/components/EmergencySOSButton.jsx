import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader } from 'lucide-react';
import api from '../services/api';

const EmergencySOSButton = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const triggerSOS = () => {
    setShowWarning(true);
  };

  const confirmSOS = () => {
    setShowWarning(false);
    setLoading(true);
    setStatus(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          let placeName = 'Immediate Location';
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              placeName = data.display_name;
            }
          } catch (e) {
            console.error("Reverse geocoding failed", e);
          }
          
          const payload = {
            name: user ? (user.first_name || user.username) : 'Anonymous',
            phone: user?.profile?.phone || 'N/A',
            address: placeName,
            location: `${lat},${lng}`,
            incident_type: 'Emergency SOS',
            description: `Instant SOS requested at ${new Date().toLocaleTimeString()}`
          };

          try {
            await api.post('/reports/', payload);
            setStatus('success');
            setTimeout(() => setStatus(null), 5000);
          } catch (err) {
            console.error("SOS failed", err);
            setStatus('error');
            setTimeout(() => setStatus(null), 5000);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error(err);
          alert("Unable to retrieve location for SOS.");
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 left-4 md:left-72 z-50 flex flex-col items-start gap-2">
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all border-t-8 border-red-600">
          <div className="flex items-center justify-center w-16 h-16 bg-red-900/50 rounded-full mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-black text-center text-white mb-2 uppercase tracking-wide">Emergency Warning</h3>
          <p className="text-sm text-slate-400 text-center mb-6 font-medium">
            This will immediately dispatch emergency services to your GPS location. <br/><br/>
            <span className="text-red-400 font-bold bg-red-900/30 p-2 block border border-red-700 rounded">
              ⚠️ False or prank SOS requests are strictly punishable by law under local jurisdiction and may result in heavy fines.
            </span>
          </p>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={confirmSOS} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow transition"
            >
              I UNDERSTAND, SEND HELP NOW
            </button>
            <button 
              onClick={() => setShowWarning(false)} 
              className="w-full bg-slate-600 hover:bg-gray-300 text-slate-100 font-bold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      )}

      {status === 'success' && (
        <div className="bg-green-900/50 text-green-300 px-4 py-2 rounded-lg shadow-lg text-sm font-bold border border-green-600 animate-bounce">
          SOS Sent Successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-900/50 text-red-300 px-4 py-2 rounded-lg shadow-lg text-sm font-bold border border-red-600">
          Failed to send SOS. Please try again or use the main form.
        </div>
      )}
      <button
        onClick={triggerSOS}
        disabled={loading}
        className="relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 md:px-8 py-4 md:py-5 rounded-full shadow-[0_10px_40px_rgba(220,38,38,0.8)] border-[3px] border-red-600 flex items-center justify-center transform transition-all hover:scale-105 active:scale-95 overflow-hidden group"
        title="Tap to send Emergency SOS"
      >
        <div className="absolute inset-0 bg-slate-800 animate-pulse opacity-10"></div>
        {loading ? (
          <Loader className="w-12 h-12 animate-spin z-10" />
        ) : (
          <div className="flex items-center z-10 space-x-3">
            <div className="bg-slate-800 text-red-600 rounded-full p-1 drop-shadow-md">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-2xl md:text-3xl font-black tracking-wider uppercase leading-none drop-shadow-md">EMERGENCY SOS</span>
              <span className="text-xs md:text-sm font-bold tracking-widest opacity-95 mt-1 uppercase bg-red-900/40 px-2 py-0.5 rounded text-white">1-Click Instant Help</span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default EmergencySOSButton;
