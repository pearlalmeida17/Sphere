import requests 
import os

api_key = os.getenv("OPENWEATHER_API_KEY")
city = "London"
url = "https://api.openweathermap.org/data/2.5/weather"

response = requests.get(url, params={"q":city, "appid":api_key, "units":"metric"})
data = response.json()
print(response.status_code)

print(f"City: {data["name"]}")
print(f"Temp: {data["main"]["temp"]}")

print(f"Condition: {data["weather"][0]["main"]}")

print(f"City: {data["main"]["humidity"]} %")