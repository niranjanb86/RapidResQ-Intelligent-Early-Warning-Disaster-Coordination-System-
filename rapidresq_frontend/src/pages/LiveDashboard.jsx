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
  
  // Tab state for detailed lists
  const [activeTab, setActiveTab] = useState('camps');

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
      
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Left Side: Map */}
        <div className="flex-[2] bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative z-0 h-[400px] lg:h-auto">
          
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

        {/* Right Side: Detailed Lists */}
        <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 flex flex-col overflow-hidden h-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button 
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'camps' ? 'bg-white border-t-2 border-green-500 text-gray-900 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('camps')}
            >
              Relief Camps
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'alerts' ? 'bg-white border-t-2 border-yellow-500 text-yellow-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('alerts')}
            >
              Active Alerts
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'reports' ? 'bg-white border-t-2 border-red-500 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('reports')}
            >
              Emergency Reports
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Camps Tab */}
            {activeTab === 'camps' && (
              data.camps.length === 0 ? <p className="text-gray-500 text-sm">No relief camps registered.</p> :
              data.camps.map(camp => (
                <div key={camp.id} className="p-3 border rounded-lg bg-green-50 border-green-200">
                  <h4 className="font-bold text-green-900">{camp.camp_name}</h4>
                  <p className="text-sm text-gray-700 mt-1"><b>Location:</b> {camp.location}</p>
                  <div className="flex justify-between mt-2 text-sm text-green-800 font-medium">
                    <span>Capacity: {camp.capacity}</span>
                    <span>Boats: {camp.boats_available}</span>
                    <span>Food Kits: {camp.food_kits_available}</span>
                  </div>
                </div>
              ))
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              data.alerts.length === 0 ? <p className="text-gray-500 text-sm">No active alerts.</p> :
              data.alerts.map(alert => (
                <div key={alert.id} className={`p-3 border rounded-lg ${
                  alert.risk_level === 'critical' ? 'bg-red-50 border-red-200' : 
                  alert.risk_level === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900">{alert.title}</h4>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white shadow-sm">{alert.risk_level}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Area: {alert.location} | Source: {alert.source}</p>
                </div>
              ))
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              data.reports.length === 0 ? <p className="text-gray-500 text-sm">No emergency reports.</p> :
              data.reports.map(report => (
                <div key={report.id} className="p-3 border rounded-lg bg-red-50 border-red-200">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-red-900">{report.incident_type}</h4>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-white shadow-sm text-gray-600 border">{report.status}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{report.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Reporter: {report.name} ({report.phone}) | Loc: {report.location}</p>
                </div>
              ))
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveDashboard;
