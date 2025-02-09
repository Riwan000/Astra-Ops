import React, { useEffect } from 'react';
import { Viewer, Entity, useCesium } from 'resium';
import { Cartesian3, Cartesian2, Color, LabelStyle, Ion } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import './CesiumViewer.css';
import { SatelliteIcon, MissionIcon } from './Icons';

interface Satellite {
  id: number;
  name: string;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
}

interface Mission {
  id: number;
  name: string;
  status: string;
}

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNzU2ZjkxMS1iMDU4LTQwZjAtOGU2YS01MjlmNDU5ZDVhOTQiLCJpZCI6MjczODgyLCJpYXQiOjE3MzkxMDQwMDd9.DM_iP80UZKFw6LWwF9iqLpHLnFFLDGxXhluJIMJMcnw';

(window as any).CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const CesiumViewer: React.FC<{ satellites?: Satellite[], missions?: Mission[] }> = ({ satellites = [], missions = [] }) => {
  const { viewer } = useCesium();

  useEffect(() => {
    if (viewer) {
      // Disable default event handlers
      viewer.scene.screenSpaceCameraController.enableRotate = false;
      viewer.scene.screenSpaceCameraController.enableTranslate = false;
      viewer.scene.screenSpaceCameraController.enableZoom = false;
      
      // Set canvas parent container style
      const container = viewer.cesiumWidget.container;
      container.style.pointerEvents = 'none';
      container.style.position = 'relative';
      container.style.zIndex = '0';
    }
  }, [viewer]);

  return (
    <div className="h-screen w-full relative space-panel">
      <div className="absolute top-4 left-4 bg-space-dark/80 backdrop-blur-sm p-4 rounded-xl shadow-xl z-[100]">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <SatelliteIcon />
          Active Missions
        </h2>
        <div className="space-y-2">
          {missions.map(mission => (
            <div key={mission.id} className="flex items-center gap-3 p-2 hover:bg-space-gray/20 rounded-lg cursor-pointer">
              <MissionIcon />
              <div>
                <p className="font-mono text-sm">{mission.name}</p>
                <p className="text-xs text-space-gray">{mission.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Viewer
        full
        baseLayerPicker={false}
        animation={false}
        timeline={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        homeButton={false}
        skyBox={false}
        skyAtmosphere={false}
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
              pixelOffset: new Cartesian2(0, -20),
              fillColor: Color.WHITE,
              outlineColor: Color.BLACK,
              outlineWidth: 2,
              style: LabelStyle.FILL_AND_OUTLINE
            }}
          />
        ))}
      </Viewer>
    </div>
  );
};

export default CesiumViewer;
