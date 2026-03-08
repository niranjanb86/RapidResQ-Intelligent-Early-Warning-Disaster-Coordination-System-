import React, { useState } from 'react';
import api from '../services/api';

const RescueDashboard = () => {
  const [volFormData, setVolFormData] = useState({ name: '', phone: '', location: '' });
  const [campFormData, setCampFormData] = useState({ camp_name: '', location: '', capacity: 0, food_kits_available: 0, medical_teams: 0, boats_available: 0 });

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

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Volunteer Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Register as Volunteer / Rescue Team</h2>
        <form onSubmit={handleVolSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Name / Team Name</label><input required className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={volFormData.name} onChange={e=>setVolFormData({...volFormData,name:e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700">Phone Number</label><input required className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={volFormData.phone} onChange={e=>setVolFormData({...volFormData,phone:e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700">Location (Lat, Lng) or Area</label><input required placeholder="e.g. 9.9312, 76.2673" className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={volFormData.location} onChange={e=>setVolFormData({...volFormData,location:e.target.value})} /></div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md font-bold hover:bg-blue-700 transition">Register Volunteer</button>
        </form>
      </div>

      {/* Camp Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
        <h2 className="text-xl font-bold mb-4 text-green-800">Register Rescue Camp / Shelter</h2>
        <form onSubmit={handleCampSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Camp Name</label><input required className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={campFormData.camp_name} onChange={e=>setCampFormData({...campFormData,camp_name:e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700">Location (Lat, Lng)</label><input required placeholder="e.g. 9.9312, 76.2673" className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={campFormData.location} onChange={e=>setCampFormData({...campFormData,location:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Total Capacity</label><input required type="number" className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={campFormData.capacity} onChange={e=>setCampFormData({...campFormData,capacity:e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Food Kits Count</label><input required type="number" className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={campFormData.food_kits_available} onChange={e=>setCampFormData({...campFormData,food_kits_available:e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Medical Teams Count</label><input required type="number" className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={campFormData.medical_teams} onChange={e=>setCampFormData({...campFormData,medical_teams:e.target.value})} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Boats Available</label><input required type="number" className="mt-1 w-full border border-gray-300 p-2 rounded-md" value={campFormData.boats_available} onChange={e=>setCampFormData({...campFormData,boats_available:e.target.value})} /></div>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md font-bold hover:bg-green-700 transition">Register Camp</button>
        </form>
      </div>
    </div>
  );
};
export default RescueDashboard;
