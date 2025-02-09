import React from 'react';
import { Link } from 'react-router-dom';
import SpaceData from '../components/SpaceData';

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden space-y-6 p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to AstraOps</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Your advanced space operations dashboard powered by artificial intelligence.
          Monitor satellites, plan missions, and explore the cosmos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/operations"
          className="block p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
        >
          <h2 className="text-2xl font-bold mb-2">🛸 Space Operations</h2>
          <p className="text-gray-300">Track satellites and optimize mission parameters in real-time.</p>
        </Link>

        <Link 
          to="/assistant"
          className="block p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
        >
          <h2 className="text-2xl font-bold mb-2">🤖 Astra AI</h2>
          <p className="text-gray-300">Get intelligent assistance for your space-related queries.</p>
        </Link>
      </div>

      <SpaceData />
    </div>
  );
};

export default Home; 