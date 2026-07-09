import requests
from dotenv import load_dotenv
import os
from models.weather import WeatherReport
from services.vibe_engine import get_vibe
from services.ai_services import get_ai_summary
from datetime import datetime, timezone, timedelta

load_dotenv()


class WeatherClient:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.cache = {}

    def get_weather(self, city: str):
        if city in self.cache:
                cached = self.cache[city.lower()]
                age = datetime.now() - cached["time"]

                if age.seconds < 30:
                    return cached["result"]



        url = "https://api.openweathermap.org/data/2.5/weather"

        
       
        try: 
            data = requests.get(url, params = {"q":city, "appid":self.api_key, "units":"metric"})
           
            if data.status_code != 200:
                return {"error": "City not found or API error"}, data.status_code
            
            raw_data = data.json()
            
            print(raw_data)
            
            lat = raw_data["coord"]["lat"]
            lon = raw_data["coord"]["lon"]

            current_utc = raw_data["dt"]
            
            aqi_data = self.get_air_quality(lat , lon)
            aqi = aqi_data["list"][0]["main"]["aqi"]
            uv_index = self.get_uv_index(lat, lon)
            vibe = get_vibe(raw_data["weather"][0]["main"], raw_data["main"]["temp"])
            summary = get_ai_summary(raw_data["name"], raw_data["main"]["temp"], raw_data["weather"][0]["main"], raw_data["main"]["humidity"], raw_data["wind"]["speed"])
            #summary = ""
           
            local_time = datetime.fromtimestamp(raw_data["dt"] + raw_data["timezone"], tz=timezone.utc).strftime("%H:%M")
            
            sunrise = datetime.fromtimestamp(raw_data["sys"]["sunrise"] +raw_data["timezone"], tz=timezone.utc).strftime("%H:%M")
            sunset = datetime.fromtimestamp(raw_data["sys"]["sunset"] +raw_data["timezone"], tz=timezone.utc).strftime("%H:%M")
            is_day = raw_data["sys"]["sunrise"] < current_utc < raw_data["sys"]["sunset"]
            feels_like = raw_data["main"]["feels_like"]
            pressure = raw_data["main"]["pressure"]
            visibility = raw_data["visibility"]

            result = WeatherReport(city=raw_data["name"],
                       temperature=raw_data["main"]["temp"],
                     weather_condition=raw_data["weather"][0]["main"],
                     humidity=raw_data["main"]["humidity"],
                       wind_speed=raw_data["wind"]["speed"],
                       aqi=aqi,
                       vibe=vibe,
                       local_time=local_time,
                       uv_index=uv_index,
                       sunrise=sunrise,
                       sunset=sunset,
                       is_day=is_day,
                       feels_like=feels_like,
                       pressure=pressure,
                       visibility=visibility,
                       summary=summary

                       )
            
            

            self.cache[city.lower()] = {"result" : result, "time" : datetime.now()}
            return result
            
            
            
        except Exception as e:
            return {"error": str(e)}, 500

    

    def get_air_quality(self, lat: float, lon : float):
        

        aqi_url = "http://api.openweathermap.org/data/2.5/air_pollution"

        air_quality_data = requests.get(aqi_url, params={"lat":lat, "lon" : lon, "appid": self.api_key})

        if  air_quality_data.status_code != 200:
                return {"error": "City not found or API error"}, air_quality_data.status_code
        
        air_quality = air_quality_data.json()

        return air_quality
    
    def get_forcast(self, city: str):
        url = "https://api.openweathermap.org/data/2.5/forecast"
        
        try:
            data = requests.get(url, params={
                 "q": city,
                 "appid": self.api_key,
                 "units": "metric"
            })

            if data.status_code !=200:
                 return {"error": "City not found"}, data.status_code
            
            raw = data.json()

            days = {}
            for item in raw["list"]:
                date = item["dt_txt"].split(" ")[0]
                temp = item["main"]["temp"]
                condition = item["weather"][0]["main"]

                if date not in days:
                    day_name = datetime.strptime(date,"%Y-%m-%d").strftime("%a")
                    days[date] = {"day": day_name, "min": round(temp), "max": round(temp), "condition": condition}
                else:
                     days[date]["min"] = min(days[date]["min"], round(temp))
                     days[date]["max"] = max(days[date]["max"], round(temp))

            return list(days.values())[:7]

        except Exception as e:
            return {"error" : str(e)}, 500

    def get_uv_index(self, lat:float, lon:float):
        uv_url = "https://api.openweathermap.org/data/2.5/uvi"
        uv_data = requests.get(uv_url, params={"lat":lat, "lon": lon, "appid": self.api_key})
        if uv_data.status_code !=200:
             return 0
        return uv_data.json()["value"]

if __name__=="__main__":

    client = WeatherClient()
    client1 = client.get_weather("London")
   
    print(client1)
    print(client.get_weather("London"))