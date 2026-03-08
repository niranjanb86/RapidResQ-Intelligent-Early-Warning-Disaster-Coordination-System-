import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import RescueDashboard from './pages/RescueDashboard';
import LiveDashboard from './pages/LiveDashboard';
import ContactsDashboard from './pages/ContactsDashboard';
import FirstAidDashboard from './pages/FirstAidDashboard';
import DonationDashboard from './pages/DonationDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AlertBanner from './components/AlertBanner';
import ChatBot from './components/ChatBot';
import EmergencySOSButton from './components/EmergencySOSButton';
import PredictionsDashboard from './pages/PredictionsDashboard';
import { ShieldAlert, Users, Radio, Map as MapIcon, Phone, FileHeart, HeartHandshake, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import api from './services/api';

function App() {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const { user, logout } = useContext(AuthContext);

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
            <Link to="/predictions" className="flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition group">
              <MapIcon className="w-5 h-5 mr-3 group-hover:text-purple-400" /> AI Predictions
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
          
          {/* User Auth Section built into Sidebar Bottom */}
          <div className="p-4 border-t border-slate-800">
            {user ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center text-sm font-medium">
                  <UserIcon className={`w-8 h-8 p-1.5 rounded-full mr-3 ${user.role === 'volunteer' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`} />
                  <div>
                    <div className="text-white capitalize">{user.first_name || user.username}</div>
                    <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center justify-center w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                <LogIn className="w-5 h-5 mr-2" /> Login / Register
              </Link>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/rescue" element={<RescueDashboard />} />
            <Route path="/live" element={<LiveDashboard />} />
            <Route path="/predictions" element={<PredictionsDashboard />} />
            <Route path="/contacts" element={<ContactsDashboard />} />
            <Route path="/first-aid" element={<FirstAidDashboard />} />
            <Route path="/donate" element={<DonationDashboard />} />
          </Routes>
        </main>
      </div>
      
      {/* Global AI Chatbot */}
      <ChatBot />
      <EmergencySOSButton />
    </div>
  );
}

export default App;
