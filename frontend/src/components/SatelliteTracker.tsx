import React, { useEffect, useState } from 'react';
import CesiumViewer from './CesiumViewer';

interface Satellite {
  id: number;
  name: string;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
}

const SatelliteTracker: React.FC = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'satellite_update' && data.data && data.data.positions) {
          setSatellites([{
            id: 1,
            name: "ISS",
            position: data.data.positions[0] || {
              latitude: 0,
              longitude: 0,
              altitude: 0
            }
          }]);
        }
      } catch (error) {
        console.error('Error processing satellite data:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🛰️ Satellite Tracker
        {wsConnected && <span className="text-sm font-normal bg-green-500/20 px-2 py-1 rounded">Live</span>}
      </h2>
      <CesiumViewer satellites={satellites} />
    </div>
  );
};

export default SatelliteTracker; 