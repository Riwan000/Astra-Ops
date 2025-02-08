import React from 'react';
import SatelliteTracker from '../components/SatelliteTracker';
import MissionPlanner from '../components/MissionPlanner';

const Operations: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Space Operations</h1>
      <div className="grid grid-cols-1 gap-6">
        <SatelliteTracker />
        <MissionPlanner />
      </div>
    </div>
  );
};

export default Operations; 