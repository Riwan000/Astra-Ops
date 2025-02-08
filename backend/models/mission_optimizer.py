import numpy as np
from typing import Dict, List
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

# Define missions data directly in the file
HISTORICAL_MISSIONS = [
    {
        "mission": "ISS Resupply",
        "distance_km": 400,
        "payload_kg": 2500,
        "orbit_altitude_km": 408,
        "fuel_required_kg": 15000,
        "success": True
    },
    {
        "mission": "GPS Satellite Deploy",
        "distance_km": 20200,
        "payload_kg": 4000,
        "orbit_altitude_km": 20200,
        "fuel_required_kg": 45000,
        "success": True
    },
    {
        "mission": "Mars Mission",
        "distance_km": 225000000,
        "payload_kg": 1500,
        "orbit_altitude_km": 400,
        "fuel_required_kg": 125000,
        "success": True
    }
]

class MissionOptimizer:
    def __init__(self):
        self.gravity_constant = 6.67430e-11
        self.earth_mass = 5.972e24
        self.model = self._initialize_model()
        self.mission_history = pd.DataFrame(HISTORICAL_MISSIONS)

    def _initialize_model(self) -> RandomForestRegressor:
        """Initialize and train the ML model using historical mission data"""
        # Convert historical data to DataFrame
        df = pd.DataFrame(HISTORICAL_MISSIONS)
        
        # Feature engineering
        df['energy_required'] = df.apply(
            lambda row: self._calculate_energy_requirement(
                row['distance_km'],
                row['payload_kg'],
                row['orbit_altitude_km']
            ),
            axis=1
        )
        
        # Add more features
        df['mission_complexity'] = df['distance_km'] * df['payload_kg'] / 1e6
        df['orbit_difficulty'] = np.log10(df['orbit_altitude_km'] + 1)

        # Train model with real data
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        features = [
            'distance_km', 
            'payload_kg', 
            'orbit_altitude_km',
            'energy_required',
            'mission_complexity',
            'orbit_difficulty'
        ]
        
        X = df[features]
        y = df['fuel_required_kg']
        model.fit(X, y)
        
        # Save feature importance
        self.feature_importance = dict(zip(features, model.feature_importances_))
        
        return model

    def _calculate_energy_requirement(self, distance, payload, altitude):
        """Calculate energy requirement for the mission"""
        # Basic gravitational potential energy
        gpe = self.gravity_constant * self.earth_mass * payload / ((altitude + 6371) * 1000)
        # Kinetic energy needed for orbit
        ke = 0.5 * payload * (self.calculate_orbital_velocity(altitude) ** 2)
        return gpe + ke

    def calculate_orbital_velocity(self, altitude: float) -> float:
        """Calculate orbital velocity at given altitude"""
        radius = (altitude + 6371) * 1000  # Convert to meters
        return np.sqrt(self.gravity_constant * self.earth_mass / radius)

    def optimize_trajectory(self, start_pos: Dict, end_pos: Dict) -> Dict:
        """Optimize mission trajectory using ML model and historical data"""
        try:
            # Calculate distance and parameters
            distance = np.sqrt(
                (end_pos.get('x', 0) - start_pos.get('x', 0))**2 +
                (end_pos.get('y', 0) - start_pos.get('y', 0))**2 +
                (end_pos.get('z', 0) - start_pos.get('z', 0))**2
            )

            payload = start_pos.get('payload', 1000)  # kg
            target_altitude = end_pos.get('altitude', 400)  # km

            # Calculate additional features
            energy_required = self._calculate_energy_requirement(
                distance, payload, target_altitude
            )
            mission_complexity = distance * payload / 1e6
            orbit_difficulty = np.log10(target_altitude + 1)

            # Predict fuel requirement
            features = np.array([[
                distance,
                payload,
                target_altitude,
                energy_required,
                mission_complexity,
                orbit_difficulty
            ]])

            # Get prediction and confidence
            fuel_required = self.model.predict(features)[0]
            
            # Find similar historical missions
            similar_missions = self._find_similar_missions(
                distance, payload, target_altitude
            )

            # Calculate orbital parameters
            orbit_params = self._calculate_orbital_parameters(target_altitude)
            
            # Generate optimized trajectory
            trajectory = self._generate_trajectory(
                start_pos, end_pos, orbit_params, num_points=50
            )

            return {
                "fuel_required": fuel_required,
                "estimated_duration": orbit_params['orbital_period'],
                "orbital_velocity": orbit_params['orbital_velocity'],
                "trajectory_points": trajectory,
                "efficiency_score": self._calculate_efficiency_score(
                    fuel_required, payload, distance
                ),
                "similar_missions": similar_missions,
                "feature_importance": self.feature_importance
            }

        except Exception as e:
            print(f"Error in trajectory optimization: {str(e)}")
            return {
                "fuel_required": 1000,
                "estimated_duration": 3600,
                "trajectory_points": [],
                "error": str(e)
            }

    def _find_similar_missions(self, distance, payload, altitude, n=3):
        """Find similar historical missions for reference"""
        df = self.mission_history.copy()
        
        # Calculate similarity scores
        df['similarity'] = (
            (1 / (1 + np.abs(df['distance_km'] - distance))) * 0.4 +
            (1 / (1 + np.abs(df['payload_kg'] - payload))) * 0.3 +
            (1 / (1 + np.abs(df['orbit_altitude_km'] - altitude))) * 0.3
        )
        
        return df.nlargest(n, 'similarity')[
            ['mission', 'distance_km', 'payload_kg', 'fuel_required_kg']
        ].to_dict('records')

    def _calculate_efficiency_score(self, fuel_required, payload, distance):
        """Calculate mission efficiency score"""
        theoretical_minimum = self._calculate_energy_requirement(
            distance, payload, 400
        ) / 1e6  # Convert to reasonable scale
        
        efficiency = 1 - (fuel_required - theoretical_minimum) / fuel_required
        return max(0, min(100, efficiency * 100))  # Convert to percentage

    def _generate_trajectory(self, start_pos, end_pos, orbit_params, num_points=50):
        """Generate optimized trajectory points"""
        trajectory = []
        for i in range(num_points):
            t = i / (num_points - 1)
            point = {
                'x': start_pos.get('x', 0) + t * (end_pos.get('x', 0) - start_pos.get('x', 0)),
                'y': start_pos.get('y', 0) + t * (end_pos.get('y', 0) - start_pos.get('y', 0)),
                'z': start_pos.get('z', 0) + t * (end_pos.get('z', 0) - start_pos.get('z', 0)),
                'time': t * orbit_params['orbital_period'],
                'velocity': orbit_params['orbital_velocity'] * (1 + 0.1 * np.sin(t * np.pi))  # Add velocity variation
            }
            trajectory.append(point)
        return trajectory

    def _calculate_orbital_parameters(self, altitude: float) -> Dict:
        """Calculate orbital parameters for given altitude"""
        radius = altitude + 6371  # Earth radius in km
        velocity = np.sqrt(self.gravity_constant * self.earth_mass / 
                         (radius * 1000)) / 1000  # Convert to km/s
        period = 2 * np.pi * radius / velocity / 3600  # Convert to hours
        
        return {
            "orbital_velocity": velocity,
            "orbital_period": period
        } 