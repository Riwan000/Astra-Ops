import { propagate, twoline2satrec } from 'satellite.js';

export const getSatellitePosition = (tleLine1: string, tleLine2: string, date: Date) => {
  const satrec = twoline2satrec(tleLine1, tleLine2);
  const positionVelocity = propagate(satrec, date);
  return positionVelocity.position;
}; 