from google import genai
import os
from dotenv import load_dotenv
load_dotenv()

def get_ai_summary(city, temperature, condition, humidity, wind_speed):
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        response = client.models.generate_content(
            model = "gemini-2.5-flash",
             contents=f"""Write a 1-2 sentence friendly weather summary for {city}.
            Conditions: {condition}, {temperature}°C, humidity {humidity}%, wind {wind_speed} m/s.
            Be concise and conversational."""
           
            )

        return response.text

    except Exception as e:
        print(f"Ai Summary Error: {e}")
        return ""
    
def get_ai_chat(message, city, temperature, condition, humidity, wind_speed, aqi, local_time, uv_index, sunrise, sunset, feels_like, pressure, visibility, forecast=None):
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        # Build forecast string if provided
        forecast_text = ""
        if forecast:
            forecast_lines = []
            for day in forecast:
                forecast_lines.append(
                    f"  - {day['day']}: {day['condition']}, Low {day['min']}°C / High {day['max']}°C"
                )
            forecast_text = "7-day forecast:\n" + "\n".join(forecast_lines)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""You are a helpful weather assistant for {city}.

Current conditions:
- Weather: {condition}
- Temperature: {temperature}°C (feels like {feels_like}°C)
- Humidity: {humidity}%
- Wind: {wind_speed} m/s
- AQI: {aqi}
- UV Index: {uv_index}
- Pressure: {pressure} hPa
- Visibility: {visibility} m
- Local time: {local_time}
- Sunrise: {sunrise} / Sunset: {sunset}

{forecast_text}

Answer this question concisely in 1-2 sentences: {message}"""
        )
        
        return response.text
    except Exception as e:
        print(f"AI chat error: {e}")
        return "Sorry, I couldn't process that right now."
    


