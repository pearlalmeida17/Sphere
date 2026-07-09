import { useState } from "react"

function useWeather(){

    const [weather, setWeather] =  useState(null)
    const [forecast, setForecast] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    async function fetchWeather(city){
    if (!city.trim()) return
    console.log("fetchWeather called with:", city)
    setWeather(null)
    setLoading(true)
    setError(null)

    try{
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(`http://localhost:8000/weather?city=${city}`),
            fetch(`http://localhost:8000/forecast?city=${city}`)
        ])
        
        
        const data = await weatherRes.json()
        const forecastData = await forecastRes.json()

        setWeather(data)
        setForecast(forecastData)

        console.log("weather set to:", data)
        console.log("weather data:", data)
        
        
        return data

    } catch (err){
        setError(err.message)
        return null
    } finally{
        setLoading(false)
    
    }
}
    return {weather,forecast, loading, error, fetchWeather}
    

}

export default useWeather