import React from 'react';
import { AlertCircle, Phone, Radio, Users } from 'lucide-react';

const StatsCard = ({ title, count, icon, colorClass }) => (
  <div className={`bg-white p-4 rounded-lg shadow flex items-center justify-between border-l-4 ${colorClass}`}>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
    </div>
    {icon}
  </div>
);

const StatsPanel = ({ data }) => {
  const activeAlerts = data.alerts.filter(a => a.risk_level === 'high' || a.risk_level === 'critical').length;
  const emergencies = data.reports.length;
  const volunteers = data.volunteers.filter(v => v.availability_status).length;
  const maxCapacity = data.camps.reduce((acc, c) => acc + c.capacity, 0);

  // Calculate Risk Level Meter
  let riskLevel = 'Green – Safe';
  let riskColor = 'bg-green-500';
  const riskScore = activeAlerts * 3 + emergencies * 1;
  if (riskScore > 10) { riskLevel = 'Red – Critical'; riskColor = 'bg-red-500'; }
  else if (riskScore > 5) { riskLevel = 'Orange – High'; riskColor = 'bg-orange-500'; }
  else if (riskScore > 0) { riskLevel = 'Yellow – Moderate'; riskColor = 'bg-yellow-500'; }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatsCard title="Active Alerts" count={activeAlerts} bg="red" icon={<AlertCircle className="text-red-500 w-8 h-8" />} colorClass="border-red-500" />
      <StatsCard title="Emergency Reports" count={emergencies} icon={<Phone className="text-orange-500 w-8 h-8" />} colorClass="border-orange-500" />
      <StatsCard title="Available Volunteers" count={volunteers} icon={<Users className="text-blue-500 w-8 h-8" />} colorClass="border-blue-500" />
      <StatsCard title="Total Shelter Cap" count={maxCapacity} icon={<Radio className="text-green-500 w-8 h-8" />} colorClass="border-green-500" />
      
      <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center col-span-2 md:col-span-1 border border-gray-200">
        <p className="text-gray-500 text-sm font-medium mb-1">Overall Risk Level</p>
        <div className={`text-white px-4 py-1 rounded-full font-bold text-sm shadow-inner tracking-wider ${riskColor}`}>
          {riskLevel}
        </div>
      </div>
    </div>
  );
};
export default StatsPanel;
