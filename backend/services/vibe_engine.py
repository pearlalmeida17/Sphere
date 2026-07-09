

def get_vibe  (condition: str, temperature: float):

    if temperature >= 30:
        temp_band = "hot"
    elif temperature >= 15:
        temp_band = "warm"
    else:
        temp_band ="cold"
    
    vibe = {
        "Clear" : {
            "hot": "golden hour haze",
            "warm": "lazy sunday afternoon",
            "cold": "crisp blue winter",
            

        },
        "Rain": {

            "hot": "the first rain",
            "warm": "heavenly showers",
            "cold": "melancholic drizzles"
            

        },
         "Thunderstorm": {
            "hot": "beach disaster",
            "warm": "mangos gone",
            "cold": "melancholic mess"
            


        },
        "Snow": {
            "any": "the white blanket"
        },
        "Clouds": {
            "hot": "hazy afternoon drift",
            "warm": "soft grey comfort",
            "cold": "heavy overcast brooding"
        },
        "Smoke": {
            "hot": "hazy urban drift",
            "warm": "grey city shroud",
            "cold": "cold smog blanket"
        },
        "Mist": {
            "hot": "steamy haze",
            "warm": "soft morning mist",
            "cold": "frozen fog"
        },
        "Haze": {
            "hot": "golden hour haze",
            "warm": "dusty amber drift",
            "cold": "pale winter shroud"
        }
    }

    return vibe.get(condition, {}).get(temp_band, "undefined_atmosphere")

if __name__ == "__main__":
    print(get_vibe("Clear", 35))
    print(get_vibe("Rain", 8))
    print(get_vibe("Snow", 20))
    print(get_vibe("Fog", 15))