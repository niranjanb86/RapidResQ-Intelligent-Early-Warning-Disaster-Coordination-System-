import React, { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import MapComponent from '../components/Map';
import StatsPanel from '../components/StatsPanel';
import api from '../services/api';

const LiveDashboard = () => {
  const [data, setData] = useState({
    alerts: [],
    reports: [],
    volunteers: [],
    camps: []
  });

  const [targetLocation, setTargetLocation] = useState('');
  const [routeConfig, setRouteConfig] = useState(null);
  const [routeError, setRouteError] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const fetchData = async () => {
    try {
      const [alerts, reports, vols, camps] = await Promise.all([
        api.get('/alerts/').then(r=>r.data),
        api.get('/reports/').then(r=>r.data),
        api.get('/volunteers/').then(r=>r.data),
        api.get('/camps/').then(r=>r.data)
      ]);
      setData({ alerts, reports, volunteers: vols, camps });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRoute = () => {
    setRouteError('');
    if (!targetLocation) {
      setRouteError("Please enter a target location");
      return;
    }

    const tParts = targetLocation.split(',');
    if (tParts.length !== 2 || isNaN(tParts[0]) || isNaN(tParts[1])) {
      setRouteError("Format must be: Lat, Lng");
      return;
    }

    const endCoords = [parseFloat(tParts[0]), parseFloat(tParts[1])];

    if (navigator.geolocation) {
      setIsNavigating(true);
      
      // Start watching the position
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newStart = [position.coords.latitude, position.coords.longitude];
          setRouteConfig(prev => {
            // Only update if start changed significantly or first time
            if (!prev || prev.start[0] !== newStart[0] || prev.start[1] !== newStart[1]) {
              return { start: newStart, end: endCoords };
            }
            return prev;
          });
        },
        (err) => {
          console.error("GPS Watch Error", err);
          if (!routeConfig) { // Only fallback if we don't have an initial location
            setRouteConfig({ start: [9.9312, 76.2673], end: endCoords });
          }
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      setWatchId(id);

    } else {
      setRouteError("Geolocation not supported. Cannot start routing.");
    }
  };

  const stopNavigation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsNavigating(false);
    setRouteConfig(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4">
      <StatsPanel data={data} />
      <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative z-0">
        
        {/* Floating Route Planner Panel */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] border-t-4 border-blue-500 w-80">
          <h3 className="text-lg font-bold flex items-center mb-3">
            <Navigation className="w-5 h-5 mr-2 text-blue-500" />
            Safe Ride Planner
          </h3>
          <p className="text-xs text-gray-500 mb-4">Routes from Current Location -&gt; Target, bypassing known disasters.</p>
          
          <input 
            type="text" 
            placeholder="Target Lat, Lng (e.g. 10.02, 76.30)" 
            className="w-full border border-gray-300 rounded p-2 text-sm mb-3"
            value={targetLocation}
            onChange={(e) => setTargetLocation(e.target.value)}
          />
          {routeError && <p className="text-red-500 text-xs mb-2">{routeError}</p>}
          
          {!isNavigating ? (
            <button 
              onClick={handleStartRoute}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded shadow hover:bg-blue-700 transition flex justify-center items-center"
            >
              <Navigation className="w-4 h-4 mr-2" /> Start Navigation
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 p-2 rounded text-blue-800 text-sm flex items-center animate-pulse">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                Live GPS Tracking Active
              </div>
              <button 
                onClick={stopNavigation}
                className="w-full bg-red-600 text-white font-bold py-2 rounded shadow hover:bg-red-700 transition"
              >
                Stop Journey
              </button>
            </div>
          )}
        </div>

        <MapComponent data={data} routeConfig={routeConfig} />
      </div>
    </div>
  );
};

export default LiveDashboard;
