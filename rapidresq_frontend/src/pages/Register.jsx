import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, UserPlus, Phone, MapPin } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    profile: {
      role: 'citizen',
      phone: '',
      location: ''
    }
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.profile) {
      setFormData({
        ...formData,
        profile: { ...formData.profile, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(Object.values(err.response?.data || {}).flat().join(', ') || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-full py-8">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 p-3 rounded-full">
            <UserPlus className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create Account</h2>
        
        {error && <div className="bg-red-900/30 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username *</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password *</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1"><Phone className="w-4 h-4 inline mr-1" /> Phone</label>
              <input type="text" name="phone" value={formData.profile.phone} onChange={handleChange} className="w-full border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1"><MapPin className="w-4 h-4 inline mr-1" /> General Location</label>
              <input type="text" name="location" value={formData.profile.location} onChange={handleChange} className="w-full border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">I am registering as a:</label>
            <div className="flex space-x-4">
              <label className={`flex-1 flex justify-center items-center p-3 border rounded-lg cursor-pointer ${formData.profile.role === 'citizen' ? 'bg-blue-900/30 border-blue-600 text-blue-400 font-bold' : 'text-slate-400'}`}>
                <input type="radio" name="role" value="citizen" checked={formData.profile.role === 'citizen'} onChange={handleChange} className="hidden" />
                Citizen (Need Help)
              </label>
              <label className={`flex-1 flex justify-center items-center p-3 border rounded-lg cursor-pointer ${formData.profile.role === 'volunteer' ? 'bg-green-900/30 border-green-600 text-green-400 font-bold' : 'text-slate-400'}`}>
                <input type="radio" name="role" value="volunteer" checked={formData.profile.role === 'volunteer'} onChange={handleChange} className="hidden" />
                Volunteer (Can Help)
              </label>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 mt-4 rounded-lg flex items-center justify-center transition"
          >
            Create Account
          </button>
        </form>
        
        <p className="mt-4 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
