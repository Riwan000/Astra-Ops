import React, { useEffect, useState } from 'react';
import CesiumViewer from './CesiumViewer';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    // Permanent test data
    setSatellites([{
      id: 1,
      name: "ISS (Test)",
      position: {
        latitude: 28.5,
        longitude: -80.6,
        altitude: 420
      }
    }]);
  }, []);

  return (
    <div className="h-full bg-black/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🛰️ Satellite Tracker
          {wsConnected && <span className="text-sm font-normal bg-green-500/20 px-2 py-1 rounded">Live</span>}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="p-2 bg-space-dark/80 rounded-full hover:bg-space-gray/20 transition-all"
        >
          🏠 Home
        </button>
      </div>
      <CesiumViewer satellites={satellites} />
    </div>
  );
};

export default SatelliteTracker; 