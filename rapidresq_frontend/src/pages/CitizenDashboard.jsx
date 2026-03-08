import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', location: '', incident_type: 'Flooded road', description: ''
  });
  
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.first_name || user.username || '',
        phone: user.profile?.phone || '',
        location: user.profile?.location || prev.location
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reports/', formData);
      setStatus('success');
      setFormData({name: '', phone: '', address: '', location: '', incident_type: 'Flooded road', description: ''});
    } catch(err) {
      setStatus('error');
    }
  }

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({...formData, location: `${position.coords.latitude},${position.coords.longitude}`});
        },
        () => alert("Unable to retrieve location.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report an Emergency</h2>
      
      {status === 'success' && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">Report submitted successfully. Help is on the way.</div>}
      {status === 'error' && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">Failed to submit report. Try again.</div>}
      {!user && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm">
          💡 Suggestion: Log in to automatically fill your contact details for faster reporting.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Incident Type</label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.incident_type} onChange={e => setFormData({...formData, incident_type: e.target.value})}>
            <option>Flooded road</option>
            <option>People trapped</option>
            <option>Medical emergency</option>
            <option>Shelter needed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location (GPS coordinates)</label>
          <div className="flex mt-1">
            <input required type="text" placeholder="Lat, Lng" className="block w-full border border-gray-300 rounded-l-md p-2" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <button type="button" onClick={handleLocation} className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 font-medium">Get GPS</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address / Landmark</label>
          <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea required rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-md font-bold hover:bg-red-700 transition">Submit Emergency Report</button>
      </form>
    </div>
  );
};

export default CitizenDashboard;
