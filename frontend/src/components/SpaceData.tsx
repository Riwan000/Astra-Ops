import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SpaceData {
  space_weather: any;
  astronomy_pic: {
    url: string;
    title: string;
    explanation: string;
  };
  satellites: any[];
}

const SpaceData: React.FC = () => {
  const [data, setData] = useState<SpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Using a static NASA image as fallback
  const fallbackImageUrl = "https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_star-forming_region_carina_nircam_final-5mb.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/space-data');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching space data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="bg-gray-800 p-4 rounded-lg">Loading space data...</div>;

  return (
    <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🌌 Space Data
        {loading && <div className="animate-pulse text-sm text-blue-400">Loading...</div>}
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-300">Astronomy Picture of the Day</h3>
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img 
              src={imageError ? fallbackImageUrl : (data?.astronomy_pic?.url || fallbackImageUrl)}
              alt="Space"
              className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-gray-300 leading-relaxed">
            {data?.astronomy_pic?.explanation || "Loading space data..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpaceData; 