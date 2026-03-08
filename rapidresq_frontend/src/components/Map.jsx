import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Custom Map Icons
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  alert: createIcon('yellow'),
  report: createIcon('red'),
  volunteer: createIcon('blue'),
  camp: createIcon('green'),
  user: createIcon('violet')
};

const avoidDisasters = (start, end, reports) => {
  // Simple heuristic: if the midpoint of the route is near a report, detour waypoints.
  const routeWaypoints = [start];
  
  if (reports && reports.length > 0) {
    let detourAdded = false;
    reports.forEach(r => {
      const parts = r.location.split(',');
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const rLat = parseFloat(parts[0]);
        const rLng = parseFloat(parts[1]);
        
        const rPoint = L.latLng(rLat, rLng);
        const distToStart = start.distanceTo(rPoint);
        const distToEnd = end.distanceTo(rPoint);
        
        // If a disaster is relatively between start and end (rough heuristic)
        if (distToStart < start.distanceTo(end) && distToEnd < start.distanceTo(end)) {
          // Add a detour waypoint perpendicular to the direct line
          const detourLat = rLat + 0.05; // ~5km offset
          const detourLng = rLng + 0.05;
          if (!detourAdded) {
            routeWaypoints.push(L.latLng(detourLat, detourLng));
            detourAdded = true;
          }
        }
      }
    });
  }

  routeWaypoints.push(end);
  return routeWaypoints;
}

const SafeRoutePlanner = ({ reports, routeConfig }) => {
  const map = useMap();
  useEffect(() => {
    if (!L.Routing || !routeConfig) return;
    
    // Create waypoints safely avoiding disasters
    const start = L.latLng(routeConfig.start[0], routeConfig.start[1]);
    const end = L.latLng(routeConfig.end[0], routeConfig.end[1]);
    const waypoints = avoidDisasters(start, end, reports);

    let control;
    try {
        control = L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          addWaypoints: false,
          show: false,
          fitSelectedRoutes: false, // Don't constantly pan bounding box while moving
          lineOptions: {
              styles: [{ color: 'green', opacity: 1, weight: 6 }]
          },
          createMarker: () => null // We'll render our own user marker below
        }).addTo(map);

        // Pan to current user location smoothly when GPS ticks
        map.panTo(start, { animate: true });

        return () => {
             map.removeControl(control);
        };
    } catch(err) {
        console.error("Routing machine err:", err);
    }
  }, [map, routeConfig, reports]);
  return null;
}

const parseLoc = (locString) => {
  if (!locString) return null;
  const parts = locString.split(',');
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parseFloat(parts[0].trim()), parseFloat(parts[1].trim())];
  }
  return null;
}

const MapComponent = ({ data, routeConfig }) => {
  const kochiLoc = [9.9312, 76.2673];

  return (
    <MapContainer center={kochiLoc} zoom={12} style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      
      {data.alerts.map(a => {
        const coords = parseLoc(a.location);
        return coords ? (
          <Marker key={`al-${a.id}`} position={coords} icon={icons.alert}>
            <Popup>
              <b>ALERT: {a.title}</b><br/>
              {a.description}<br/>Risk: {a.risk_level}
            </Popup>
          </Marker>
        ) : null;
      })}

      {data.reports.map(r => {
        const coords = parseLoc(r.location);
        return coords ? (
          <Marker key={`rep-${r.id}`} position={coords} icon={icons.report}>
            <Popup>
              <b>{r.incident_type}</b><br/>
              {r.description}<br/>Reported by: {r.name}<br/>
              Status: {r.status}
            </Popup>
          </Marker>
        ) : null;
      })}
      
      {data.volunteers.map(v => {
        const coords = parseLoc(v.location);
        return coords ? (
          <Marker key={`vol-${v.id}`} position={coords} icon={icons.volunteer}>
            <Popup>
              <b>Rescue Team: {v.name}</b><br/>
              Phone: {v.phone}
            </Popup>
          </Marker>
        ) : null;
      })}

      {data.camps.map(c => {
        const coords = parseLoc(c.location);
        return coords ? (
          <Marker key={`cmp-${c.id}`} position={coords} icon={icons.camp}>
            <Popup>
              <b>Camp: {c.camp_name}</b><br/>
              Boats: {c.boats_available} | Food Kits: {c.food_kits_available}
            </Popup>
          </Marker>
        ) : null;
      })}

      {routeConfig && (
        <Marker position={routeConfig.start} icon={icons.user}>
           <Popup><b>You are here</b><br/>Navigating...</Popup>
        </Marker>
      )}

      <SafeRoutePlanner reports={data.reports} routeConfig={routeConfig} />
    </MapContainer>
  );
};

export default MapComponent;
