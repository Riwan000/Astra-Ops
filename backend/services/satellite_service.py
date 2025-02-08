import httpx
from typing import Dict, List
import os

class SatelliteService:
    def __init__(self):
        self.base_url = "https://api.n2yo.com/rest/v1/satellite"
        self.api_key = os.getenv("N2YO_API_KEY")

    async def get_satellite_positions(self, satellite_id: int) -> Dict:
        """Get satellite positions using N2YO API"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/positions",
                params={
                    "apiKey": self.api_key,
                    "satid": satellite_id,
                    "seconds": 2
                }
            )
            return response.json() 