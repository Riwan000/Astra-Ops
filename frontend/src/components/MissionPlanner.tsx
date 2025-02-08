import React, { useState } from 'react';
import axios from 'axios';

interface MissionPlan {
  success: boolean;
  optimized_path: any[];
  estimated_duration: string;
  fuel_efficiency: string;
}

const MissionPlanner: React.FC = () => {
  const [plan, setPlan] = useState<MissionPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const optimizeMission = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/mission/optimize');
      setPlan(response.data);
    } catch (error) {
      console.error('Error optimizing mission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6">🛸 Mission Planner</h2>
      
      <button
        onClick={optimizeMission}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-3 rounded-lg
                   font-semibold transition-colors duration-200 shadow-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
            Optimizing...
          </>
        ) : '🚀 Optimize Mission'}
      </button>

      {plan && (
        <div className="mt-6 space-y-4 bg-gray-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Duration:</span>
            <span className="text-blue-300 font-mono">{plan.estimated_duration}s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Fuel Efficiency:</span>
            <span className="text-green-300 font-mono">{plan.fuel_efficiency}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionPlanner; 