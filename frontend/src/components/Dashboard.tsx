import React from 'react';
import SpaceData from './SpaceData';
import MissionPlanner from './MissionPlanner';
import SatelliteTracker from './SatelliteTracker';
import ChatBot from './ChatBot';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="bg-black/30 backdrop-blur-sm p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🚀 Space Operations Dashboard
            <span className="text-sm font-normal bg-blue-500/20 px-2 py-1 rounded">Live</span>
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpaceData />
          <MissionPlanner />
          <div className="md:col-span-2">
            <SatelliteTracker />
          </div>
          <div className="md:col-span-2">
            <ChatBot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 