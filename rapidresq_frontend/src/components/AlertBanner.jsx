import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      alerts.forEach(alert => {
        if (!sessionStorage.getItem(`alert-${alert.id}`)) {
          new Notification("Disaster Alert", {
            body: `${alert.title}: ${alert.description}`,
          });
          sessionStorage.setItem(`alert-${alert.id}`, 'true');
        }
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, [alerts]);

  return (
    <div className="bg-red-600 text-white shadow-md z-50 animate-pulse">
      <div className="max-w-7xl flex items-start px-4 py-3">
        <AlertTriangle className="h-6 w-6 text-white mr-3 shrink-0" />
        <div className="flex flex-col">
          <span className="font-bold text-lg uppercase tracking-wide">Critical Alert</span>
          <ul className="text-red-100 text-sm mt-1 list-disc list-inside">
            {alerts.map(a => (
              <li key={a.id}>
                <span className="font-semibold">{a.title}</span>: {a.description} ({a.location})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
