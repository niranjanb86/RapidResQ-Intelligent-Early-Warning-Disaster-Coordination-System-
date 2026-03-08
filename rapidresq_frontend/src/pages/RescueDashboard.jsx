import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RescueDashboard = () => {
  const { user } = useContext(AuthContext);
  const [volFormData, setVolFormData] = useState({ name: '', phone: '', location: '' });
  const [campFormData, setCampFormData] = useState({ camp_name: '', location: '', capacity: 0, food_kits_available: 0, medical_teams: 0, boats_available: 0 });
  const [pendingReports, setPendingReports] = useState([]);
  const [assignedReports, setAssignedReports] = useState([]);

  useEffect(() => {
    if (user && user.role === 'volunteer') {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/reports/');
      setPendingReports(data.filter(r => r.status === 'pending'));
      setAssignedReports(data.filter(r => (r.status === 'assigned' || r.status === 'en_route') && r.assigned_volunteer === user.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttend = async (reportId) => {
    try {
      await api.patch(`/reports/${reportId}/`, { status: 'assigned', assigned_volunteer: user.id });
      fetchReports();
    } catch (err) {
      console.error("Error attending rescue", err);
    }
  };

  const handleResolve = async (reportId) => {
    try {
      await api.patch(`/reports/${reportId}/`, { status: 'resolved' });
      fetchReports();
    } catch (err) {
      console.error("Error resolving rescue", err);
    }
  };

  const handleVolSubmit = async (e) => {
    e.preventDefault();
    await api.post('/volunteers/', volFormData);
    alert('Volunteer Registered!');
    setVolFormData({ name: '', phone: '', location: '' });
  }

  const handleCampSubmit = async (e) => {
    e.preventDefault();
    await api.post('/camps/', campFormData);
    alert('Camp Registered!');
    setCampFormData({ camp_name: '', location: '', capacity: 0, food_kits_available: 0, medical_teams: 0, boats_available: 0 });
  }

  const handleVolLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let placeName = '';
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              placeName = ` | ${data.display_name}`;
            }
          } catch (e) {
            console.error("Reverse geocoding failed", e);
          }
          setVolFormData({...volFormData, location: `${lat},${lng}${placeName}`});
        },
        () => alert("Unable to retrieve location.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleCampLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let placeName = '';
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              placeName = ` | ${data.display_name}`;
            }
          } catch (e) {
            console.error("Reverse geocoding failed", e);
          }
          setCampFormData({...campFormData, location: `${lat},${lng}${placeName}`});
        },
        () => alert("Unable to retrieve location.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!user || user.role !== 'volunteer') {
    return (
      <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-lg shadow-md text-center py-20">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Rescue Coordinator Access Restricted</h2>
        <p className="text-slate-400 mb-6">You must be logged in as a registered Volunteer to view this dashboard and coordinate rescues.</p>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Login as Volunteer
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Actionable List for Active Volunteers */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-md border-t-4 border-red-500">
        <h2 className="text-xl font-bold mb-4 text-red-300">Your Actionable Rescues</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-300 bg-slate-900 p-2 rounded mb-3">Currently Assigned ({assignedReports.length})</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {assignedReports.length === 0 ? <p className="text-sm text-slate-400">No active assignments.</p> : assignedReports.map(r => {
                const parts = (r.location || "").split('|');
                const rawCoords = parts[0].trim();
                const addr = r.address ? r.address : (parts[1] ? parts[1].trim() : '');
                const displayLoc = addr ? `${addr} (${rawCoords})` : rawCoords;
                
                return (
                  <div key={r.id} className="p-3 border rounded-lg bg-blue-900/30 border-blue-700">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{r.incident_type}</span>
                      <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">Assigned</span>
                    </div>
                    <div className="text-sm text-slate-400 mb-2 font-medium">📍 {displayLoc}</div>
                    <div className="text-sm text-slate-400 mb-3 border-t border-blue-800 pt-2">Reporter: {r.name} | 📞 {r.phone}</div>
                    <button onClick={() => handleResolve(r.id)} className="w-full text-sm bg-green-500 hover:bg-green-600 text-white py-1.5 rounded transition">
                      Mark Resolved
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-300 bg-slate-900 p-2 rounded mb-3">Pending Help ({pendingReports.length})</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {pendingReports.length === 0 ? <p className="text-sm text-slate-400">No pending rescues.</p> : pendingReports.map(r => {
                const parts = (r.location || "").split('|');
                const rawCoords = parts[0].trim();
                const addr = r.address ? r.address : (parts[1] ? parts[1].trim() : '');
                const displayLoc = addr ? `${addr} (${rawCoords})` : rawCoords;

                return (
                  <div key={r.id} className="p-3 border rounded-lg bg-red-900/30 border-red-700">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{r.incident_type}</span>
                      <span className="text-xs text-red-600">{new Date(r.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-sm text-slate-400 mb-2 font-medium">📍 {displayLoc}</div>
                    <div className="text-sm text-slate-400 mb-3 border-t border-red-800 pt-2">Reporter: {r.name}</div>
                    <button onClick={() => handleAttend(r.id)} className="w-full text-sm bg-red-600 hover:bg-red-700 text-white py-1.5 rounded transition">
                      Attend to Rescue
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Forms Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Volunteer Form */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4 text-blue-300">Register Additional Team</h2>
          <form onSubmit={handleVolSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-300">Team Name</label><input required className="mt-1 w-full border border-slate-600 p-2 rounded-md" value={volFormData.name} onChange={e=>setVolFormData({...volFormData,name:e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-slate-300">Phone Number</label><input required className="mt-1 w-full border border-slate-600 p-2 rounded-md" value={volFormData.phone} onChange={e=>setVolFormData({...volFormData,phone:e.target.value})} /></div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Location (Lat, Lng) or Area</label>
              <div className="flex mt-1">
                <input required placeholder="e.g. 9.9312, 76.2673" className="w-full border border-slate-600 p-2 rounded-l-md" value={volFormData.location} onChange={e=>setVolFormData({...volFormData,location:e.target.value})} />
                <button type="button" onClick={handleVolLocation} className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 font-medium whitespace-nowrap">Get GPS</button>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md font-bold hover:bg-blue-700 transition">Register Team</button>
          </form>
        </div>

        {/* Camp Form */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-xl font-bold mb-4 text-green-300">Register Rescue Camp / Shelter</h2>
          <form onSubmit={handleCampSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-300">Camp Name</label><input required className="mt-1 w-full border border-slate-600 p-2 rounded-md" value={campFormData.camp_name} onChange={e=>setCampFormData({...campFormData,camp_name:e.target.value})} /></div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Location (Lat, Lng)</label>
              <div className="flex mt-1">
                <input required placeholder="e.g. 9.9312, 76.2673" className="w-full border border-slate-600 p-2 rounded-l-md" value={campFormData.location} onChange={e=>setCampFormData({...campFormData,location:e.target.value})} />
                <button type="button" onClick={handleCampLocation} className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 font-medium whitespace-nowrap">Get GPS</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-300">Total Capacity</label><input required type="number" className="mt-1 w-full border border-slate-600 p-2 rounded-md" value={campFormData.capacity} onChange={e=>setCampFormData({...campFormData,capacity:e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-300">Food Kits Count</label><input required type="number" className="mt-1 w-full border border-slate-600 p-2 rounded-md" value={campFormData.food_kits_available} onChange={e=>setCampFormData({...campFormData,food_kits_available:e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-300">Medical Teams Count</label><input required type="number" className="mt-1 w-full border border-slate-600 p-2 rounded-md" value={campFormData.medical_teams} onChange={e=>setCampFormData({...campFormData,medical_teams:e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-300">Boats Available</label><input required type="number" className="mt-1 w-full border border-slate-600 p-2 rounded-md" value={campFormData.boats_available} onChange={e=>setCampFormData({...campFormData,boats_available:e.target.value})} /></div>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md font-bold hover:bg-green-700 transition">Register Camp</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default RescueDashboard;
