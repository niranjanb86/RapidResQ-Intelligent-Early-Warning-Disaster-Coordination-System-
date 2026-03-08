import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader } from 'lucide-react';
import api from '../services/api';

const EmergencySOSButton = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSOS = () => {
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
      {status === 'success' && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm font-bold border border-green-300 animate-bounce">
          SOS Sent Successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg text-sm font-bold border border-red-300">
          Failed to send SOS. Please try again or use the main form.
        </div>
      )}
      <button
        onClick={handleSOS}
        disabled={loading}
        className="relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 md:px-8 py-4 md:py-5 rounded-full shadow-[0_10px_40px_rgba(220,38,38,0.8)] border-[3px] border-red-300 flex items-center justify-center transform transition-all hover:scale-105 active:scale-95 overflow-hidden group"
        title="Tap to send Emergency SOS"
      >
        <div className="absolute inset-0 bg-white animate-pulse opacity-10"></div>
        {loading ? (
          <Loader className="w-12 h-12 animate-spin z-10" />
        ) : (
          <div className="flex items-center z-10 space-x-3">
            <div className="bg-white text-red-600 rounded-full p-1 drop-shadow-md">
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
