import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import RescueDashboard from './pages/RescueDashboard';
import LiveDashboard from './pages/LiveDashboard';
import ContactsDashboard from './pages/ContactsDashboard';
import FirstAidDashboard from './pages/FirstAidDashboard';
import DonationDashboard from './pages/DonationDashboard';
import AlertBanner from './components/AlertBanner';
import ChatBot from './components/ChatBot';
import { ShieldAlert, Users, Radio, Map as MapIcon, Phone, FileHeart, HeartHandshake } from 'lucide-react';
import api from './services/api';

function App() {
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    // Poll for active alerts every 10 seconds
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/alerts/active-alerts/');
        setActiveAlerts(response.data);
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AlertBanner alerts={activeAlerts} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
          <div className="p-4 bg-slate-950 flex items-center space-x-2">
            <ShieldAlert className="text-red-500 w-8 h-8" />
            <span className="text-xl font-bold text-white tracking-widest">RapidResQ</span>
          </div>
          <div className="flex-1 py-6 space-y-2">
            <Link to="/" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <ShieldAlert className="w-5 h-5 mr-3 group-hover:text-red-400" /> Landing
            </Link>
            <Link to="/citizen" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <Users className="w-5 h-5 mr-3 group-hover:text-blue-400" /> Citizen Dash
            </Link>
            <Link to="/rescue" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <Radio className="w-5 h-5 mr-3 group-hover:text-green-400" /> Rescue Dash
            </Link>
            <Link to="/live" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <MapIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400" /> Live Map
            </Link>
            <div className="border-t border-slate-800 my-2"></div>
            <Link to="/contacts" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <Phone className="w-5 h-5 mr-3 group-hover:text-blue-400" /> Contacts & SOS
            </Link>
            <Link to="/first-aid" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <FileHeart className="w-5 h-5 mr-3 group-hover:text-red-400" /> First Aid Hub
            </Link>
            <Link to="/donate" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <HeartHandshake className="w-5 h-5 mr-3 group-hover:text-pink-400" /> Donate Funds
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/rescue" element={<RescueDashboard />} />
            <Route path="/live" element={<LiveDashboard />} />
            <Route path="/contacts" element={<ContactsDashboard />} />
            <Route path="/first-aid" element={<FirstAidDashboard />} />
            <Route path="/donate" element={<DonationDashboard />} />
          </Routes>
        </main>
      </div>
      
      {/* Global AI Chatbot */}
      <ChatBot />
    </div>
  );
}

export default App;
