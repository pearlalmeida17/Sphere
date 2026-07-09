from dataclasses import dataclass

@dataclass
class WeatherReport:
    city: str
    temperature: float
    weather_condition: str
    humidity: int
    wind_speed: float
    aqi: int
    vibe: str
    local_time: str
    uv_index : float
    sunrise: str
    sunset: str
    is_day: bool
    feels_like: float
    pressure: int
    visibility: int 
    summary : str


