import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Phone, Navigation } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          RapidResQ
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          Intelligent Early Warning & Disaster Coordination System
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Link to="/citizen" className="bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <Phone className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-lg font-bold">Report Emergency</h2>
          <p className="text-slate-400 text-center mt-2">Request immediate assistance or report hazards.</p>
        </Link>
        <Link to="/live" className="bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <Navigation className="h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-lg font-bold">Live Dashboard</h2>
          <p className="text-slate-400 text-center mt-2">View real-time disaster map and safe routes.</p>
        </Link>
        <Link to="/rescue" className="bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-lg font-bold">Rescue Coordinator</h2>
          <p className="text-slate-400 text-center mt-2">Manage volunteers and rescue camps.</p>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
