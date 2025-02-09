from fastapi import FastAPI, HTTPException, WebSocket, Depends, status, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import httpx
import os
import json
import asyncio
from datetime import datetime
from dotenv import load_dotenv
from models.mission_optimizer import MissionOptimizer
from services.satellite_service import SatelliteService
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from services.auth_service import (
    Token, User, verify_password, create_access_token, 
    verify_token, get_password_hash
)
from models.database import get_db, DBUser
from sqlalchemy.orm import Session
from middleware.security import RateLimitMiddleware
from requests import post
from pydantic import BaseModel

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Space Operations Dashboard API",
    description="Backend API for the AI-powered space operations dashboard",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware
app.add_middleware(RateLimitMiddleware)

# Initialize services
satellite_service = SatelliteService()
mission_optimizer = MissionOptimizer()

# NASA API configuration
NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_BASE_URL = "https://api.nasa.gov"

# Add Deepseek configuration
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions"  # Updated endpoint

# WebSocket connections store
active_connections: List[WebSocket] = []

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user database - Replace with actual database in production
fake_users_db = {}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token)
    if token_data is None:
        raise credentials_exception
    user = fake_users_db.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def fetch_nasa_data(endpoint: str) -> Dict:
    """Fetch data from NASA API"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{NASA_BASE_URL}{endpoint}",
            params={"api_key": NASA_API_KEY}
        )
        return response.json()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Get ISS position
            satellite_data = await satellite_service.get_satellite_positions(25544)
            if satellite_data:
                await websocket.send_json({
                    "type": "satellite_update",
                    "data": satellite_data
                })
            await asyncio.sleep(5)  # Update every 5 seconds
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        if websocket in active_connections:
            active_connections.remove(websocket)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AI Space Operations Dashboard API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Space Data endpoints
@app.get("/api/space-data")
async def get_space_data():
    try:
        # Fetch real space data from NASA APIs
        space_weather = await fetch_nasa_data("/DONKI/notifications")
        astronomy_pic = await fetch_nasa_data("/planetary/apod")
        satellites = await satellite_service.get_satellite_positions(25544)  # ISS ID
        
        return {
            "space_weather": space_weather,
            "astronomy_pic": astronomy_pic,
            "satellites": [satellites]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Mission Planning endpoints
@app.post("/api/mission/optimize")
async def optimize_mission(mission_params: Dict):
    try:
        optimized_path = mission_optimizer.optimize_trajectory(
            mission_params.get("start_pos", {}),
            mission_params.get("end_pos", {})
        )
        return optimized_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chatbot endpoint
@app.post("/api/chat")
async def chat(message: Dict):
    try:
        if not DEEPSEEK_API_KEY:
            print("OpenRouter API key missing")
            raise HTTPException(
                status_code=500,
                detail="OpenRouter API key not configured"
            )

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                DEEPSEEK_API_URL,
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://astraops.com",
                    "X-Title": "AstraOps AI"
                },
                json={
                    "model": "deepseek/deepseek-r1:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are Astra AI, an advanced space operations assistant."
                        },
                        {"role": "user", "content": message.get("text", "")}
                    ]
                }
            )

            if response.status_code != 200:
                print(f"OpenRouter API error: {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"OpenRouter API error: {response.text}"
                )

            response_data = response.json()
            return {
                "response": response_data["choices"][0]["message"]["content"],
                "timestamp": datetime.now().isoformat()
            }

    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat: {str(e)}"
        )

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
async def register_user(
    username: str, 
    password: str, 
    email: str, 
    db: Session = Depends(get_db)
):
    if db.query(DBUser).filter(DBUser.username == username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(password)
    db_user = DBUser(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "User registered successfully"}

class MissionResponse(BaseModel):
    id: str
    name: str
    type: str
    start_time: datetime
    end_time: datetime
    status: str

@app.get("/api/missions", response_model=List[MissionResponse])
async def get_missions():
    return [
        {
            "id": "iss",
            "name": "International Space Station",
            "type": "satellite",
            "start_time": datetime(1998, 11, 20),
            "end_time": datetime(2028, 11, 20),
            "status": "active"
        },
        {
            "id": "perseverance",
            "name": "Mars Perseverance Rover",
            "type": "rover", 
            "start_time": datetime(2020, 7, 30),
            "end_time": datetime(2030, 7, 30),
            "status": "active"
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
