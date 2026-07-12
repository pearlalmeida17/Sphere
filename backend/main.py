from fastapi import FastAPI
from services.weather_client import WeatherClient
from services.ai_services import get_ai_chat
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    #allow_origins=["http://localhost:5173", "https://sphere-pearalmeida.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    city: str
    temperature: float
    condition: str      
    humidity: int 
    wind_speed: float
    aqi: int
    local_time: str
    uv_index : float
    sunrise: str
    sunset: str
    feels_like: float
    pressure: float
    visibility: float 
    forecast: Optional[list] = None

client = WeatherClient()

@app.get("/")
def home():
    return {"message":"hello"}

@app.get("/weather")
def weather(city: str):
    
    city_weather = client.get_weather(city)
    
    return city_weather

@app.post("/chat")
async def chat(request: ChatRequest):
    print("Chat request received:", request)
    response = get_ai_chat(
        request.message,
        request.city,
        request.temperature,
        request.condition,
        request.humidity,
        request.wind_speed,
        request.aqi,
        request.local_time,
        request.uv_index,
        request.sunrise,
        request.sunset,
        request.feels_like,
        request.pressure,
        request.visibility,
        request.forecast
    )

    return {"response": response}

@app.get("/forecast")
def forecast(city: str):
    city_forecast = client.get_forcast(city)
    return city_forecast