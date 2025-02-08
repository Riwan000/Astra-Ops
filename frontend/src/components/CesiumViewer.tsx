import React from 'react';
import { Viewer, Entity } from 'resium';
import { Cartesian3, Color, Ion } from '@cesium/engine';
import NoSleep from 'nosleep.js';

// Set your Cesium Ion access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDY5ODA2Yi05YmQwLTQ5MTMtOTNkZi1lOGE2NjQ3N2RiNDQiLCJpZCI6MjczODgyLCJpYXQiOjE3Mzg5NDA5Mzd9.Ge-26o_kXtUBdFONXSIt8QhpRJK5RY3idjSJzhsABgg';

interface Satellite {
  id: number;
  name: string;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
}

interface CesiumViewerProps {
  satellites?: Satellite[];
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({ satellites = [] }) => {
  const [noSleep] = React.useState(() => new NoSleep());

  React.useEffect(() => {
    const enableNoSleep = () => {
      noSleep.enable();
    };
    document.addEventListener('click', enableNoSleep, { once: true });
    return () => {
      noSleep.disable();
    };
  }, [noSleep]);

  return (
    <div className="h-[500px] w-full">
      <Viewer 
        full
        baseLayerPicker={false}
        animation={false}
        fullscreenButton={false}
        timeline={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        homeButton={false}
      >
        {satellites.map((satellite) => (
          <Entity
            key={satellite.id}
            position={Cartesian3.fromDegrees(
              satellite.position.longitude,
              satellite.position.latitude,
              satellite.position.altitude * 1000
            )}
            point={{ pixelSize: 10, color: Color.RED }}
            label={{
              text: satellite.name,
              font: '14px sans-serif',
              pixelOffset: new Cartesian3(0, -20, 0),
              fillColor: Color.WHITE,
              outlineColor: Color.BLACK,
              outlineWidth: 2,
              style: 2
            }}
          />
        ))}
      </Viewer>
    </div>
  );
};

export default CesiumViewer; 