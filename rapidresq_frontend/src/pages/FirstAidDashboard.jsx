import React, { useState } from 'react';
import { HeartPulse, Droplets, Wind, Flame, AlertCircle } from 'lucide-react';

const guides = [
  {
    icon: Droplets,
    title: 'Flood Precautions & First Aid',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    content: [
      'Avoid walking or driving through flood waters (6 inches of moving water can knock you down).',
      'Wash thoroughly if brought into contact with floodwater, which may carry diseases or chemicals.',
      'Do not touch electrical equipment if you are wet or standing in water.',
      'First Aid: For minor cuts, clean with bottled or boiled water and soap immediately to prevent infection.',
    ]
  },
  {
    icon: Wind,
    title: 'Cyclone & Hurricane Guidelines',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    content: [
      'Stay indoors and away from windows and glass doors.',
      'Turn off main power switches if water enters your home.',
      'Keep an emergency kit ready (flashlight, batteries, first aid, water).',
      'First Aid: Treat crush injuries by applying direct pressure to bleeding. Do not move individuals with suspected spinal injuries unless in immediate danger.',
    ]
  },
  {
    icon: Flame,
    title: 'Fire Emergency & Burns',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    content: [
      'Get out quickly. Do not stop to collect belongings.',
      'Stay low to the ground to avoid inhaling smoke.',
      'First Aid (Burns): Cool the burn under cool running water for at least 10 minutes. Do NOT apply ice, butter, or ointments.',
      'Cover the burn loosely with sterile, non-fluffy dressing or cling film.',
    ]
  },
  {
    icon: HeartPulse,
    title: 'General First Aid (CPR & Bleeding)',
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    content: [
      'CPR: Push hard and fast in the center of the chest (100-120 pushes a minute) if the person is unresponsive and not breathing.',
      'Bleeding: Apply firm, direct pressure over the wound with a clean cloth until bleeding stops.',
      'Choking: Perform abdominal thrusts (Heimlich maneuver) just above the belly button.',
      'Shock: Lay the person down, elevate their legs slightly if it causes no pain, and keep them warm.',
    ]
  }
];

const FirstAidDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <AlertCircle className="w-10 h-10 text-red-600" />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">First Aid & Precautions</h2>
          <p className="text-gray-500 mt-1">Essential life-saving tips and disaster preparedness guidelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, idx) => {
          const Icon = guide.icon;
          return (
            <div key={idx} className={`border ${guide.border} ${guide.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition`}>
              <div className="flex items-center space-x-3 mb-4">
                <Icon className={`w-8 h-8 ${guide.color}`} />
                <h3 className="text-xl font-bold text-gray-800">{guide.title}</h3>
              </div>
              <ul className="space-y-3">
                {guide.content.map((point, i) => (
                  <li key={i} className="flex items-start text-gray-700">
                    <span className="text-xl mr-2 leading-none">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default FirstAidDashboard;
