import React, { useState } from 'react';
import { Brain, CloudLightning, Waves, Wind, AlertTriangle, TrendingUp, ShieldAlert, Activity } from 'lucide-react';

const mockPredictions = [
  {
    id: 1,
    region: 'Kochi (Ernakulam District)',
    disasterType: 'Urban Flooding',
    probability: 85,
    severity: 'High',
    eta: 'Approaching in 12-24 hours',
    indicators: ['Unprecedented rainfall (150mm expected)', 'High tide warning', 'Drainage system at capacity'],
    aiConfidence: 92,
    recommendations: ['Evacuate low-lying areas near Periyar river', 'Move vehicles to higher ground', 'Stock emergency supplies'],
    icon: Waves,
    color: 'blue'
  },
  {
    id: 2,
    region: 'Idukki Reservoir Catchment',
    disasterType: 'Landslide',
    probability: 72,
    severity: 'Severe',
    eta: 'Within 48 hours',
    indicators: ['Soil moisture exceeding threshold by 40%', 'Continuous precipitation over 72 hrs', 'Historical landslide susceptibility match'],
    aiConfidence: 88,
    recommendations: ['Halt all quarrying activities', 'Prepare rescue camps in safe zones', 'Restrict tourist movement'],
    icon: TrendingUp,
    color: 'yellow'
  },
  {
    id: 3,
    region: 'Coastal Thiruvananthapuram',
    disasterType: 'Cyclone / Sea Surge',
    probability: 95,
    severity: 'Critical',
    eta: 'Approaching in 6-12 hours',
    indicators: ['Depression intensifying over Arabian sea', 'Wind speeds tracking > 90kmph', 'Wave height anomaly detected'],
    aiConfidence: 98,
    recommendations: ['Immediate total ban on fishing', 'Evacuate coastal settlements within 500m', 'Secure loose structures'],
    icon: Wind,
    color: 'red'
  },
  {
    id: 4,
    region: 'Palakkad Gap',
    disasterType: 'Heatwave',
    probability: 60,
    severity: 'Moderate',
    eta: 'Expected next week',
    indicators: ['Sustained temperature pattern > 40°C predicted', 'Lack of pre-monsoon showers'],
    aiConfidence: 75,
    recommendations: ['Issue work hour advisories', 'Prepare medical facilities for heatstroke cases'],
    icon: CloudLightning,
    color: 'orange'
  }
];

const PredictionCard = ({ prediction }) => {
  const Icon = prediction.icon;
  
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'Severe': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'High': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getProgressColor = (prob) => {
    if (prob > 80) return 'bg-red-500';
    if (prob > 60) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-l-4 overflow-hidden ${
      prediction.severity === 'Critical' ? 'border-red-500' : 
      prediction.severity === 'Severe' ? 'border-orange-500' : 
      prediction.severity === 'High' ? 'border-blue-500' : 'border-yellow-500'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${getSeverityStyle(prediction.severity)} bg-opacity-50`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{prediction.region}</h3>
              <p className="text-sm font-semibold text-gray-500">{prediction.disasterType}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getSeverityStyle(prediction.severity)}`}>
            {prediction.severity}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-gray-700">Occurrence Probability</span>
              <span className="font-bold">{prediction.probability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className={`${getProgressColor(prediction.probability)} h-2 rounded-full transition-all duration-1000`} style={{ width: `${prediction.probability}%` }}></div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mb-2">
              <Activity className="w-4 h-4 mr-2 text-indigo-500" />
              <span>AI Confidence Score: <b>{prediction.aiConfidence}%</b></span>
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center">
              <ShieldAlert className="w-3 h-3 mr-1" /> Key Indicators
            </h4>
            <ul className="text-sm space-y-1">
              {prediction.indicators.map((ind, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-gray-900">Recommended Actions (ETA: {prediction.eta})</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {prediction.recommendations.map((rec, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-3 py-1.5 rounded-md font-medium border border-gray-200">
                {rec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PredictionsDashboard = () => {
  const [filter, setFilter] = useState('All');

  const filteredPredictions = filter === 'All' 
    ? mockPredictions 
    : mockPredictions.filter(p => {
        if (filter === 'Flood') return p.disasterType.includes('Flood');
        if (filter === 'Cyclone') return p.disasterType.includes('Cyclone');
        return p.severity === filter;
      });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Brain className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-indigo-400" />
              AI Disaster Predictions
            </h1>
            <p className="text-slate-300 max-w-2xl text-lg">
              Advanced machine learning models continuously analyzing local meteorological data, soil sensors, and historical patterns to forecast high-risk disaster zones before they occur.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center min-w-[200px]">
            <div className="text-4xl font-black text-white mb-1">94.2%</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-bold">System Accuracy Rate</div>
            <div className="text-xs text-green-400 mt-2 flex items-center justify-center">
              <Activity className="w-3 h-3 mr-1" /> Models Online & Analyzing
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mr-2">Filter By:</span>
        {['All', 'Critical', 'Severe', 'Flood', 'Cyclone'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              filter === f 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Predictions Grid */}
      <div className="grid gap-6">
        {filteredPredictions.length > 0 ? (
          filteredPredictions.map(prediction => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))
        ) : (
          <div className="text-center bg-white p-12 rounded-xl border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No predictions matching filter</h3>
            <p className="text-gray-500">Try selecting a different category or 'All'.</p>
          </div>
        )}
      </div>
      
      {/* Disclaimer Section */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5 flex items-start space-x-4">
        <AlertTriangle className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-indigo-900 mb-1">How do these predictions work?</h4>
          <p className="text-sm text-indigo-700 leading-relaxed">
            RapidResQ utilizes an ensemble of predictive models processing real-time satellite imagery, IMD weather feeds, topographical vulnerability indices, and IoT river-level sensors. The <b>Occurrence Probability</b> represents the likelihood of a major disruption within the given timeframe, allowing government bodies and relief camps to preposition resources efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionsDashboard;
