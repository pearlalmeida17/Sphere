import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import WeatherStats from "./WeatherStats"
import ForecastBar from "./ForecastBar"

function WeatherModal({ weather, selectedCity, onClose, forecast, isCelsius, convertTemp, isFav, onToggleFav, is24Hour, formatTime}) {
  if (!selectedCity) return null

  const [closing, setClosing] = useState(false)
  const [insight, setInsight] = useState("")

  function handleClose() {
    setClosing(true)
    setTimeout(() => { setClosing(false); onClose() }, 600)
  }

  useEffect(() => {
    if (!weather) return
    setInsight("")
    const controller = new AbortController()
    fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message: "Give one short practical tip for today based on the weather. Max 2 sentences.",
        city: weather.city,
        temperature: weather.temperature,
        condition: weather.weather_condition,
        humidity: weather.humidity,
        wind_speed: weather.wind_speed,
        aqi: weather.aqi,
        local_time: weather.local_time,
        uv_index: weather.uv_index,
        sunrise: weather.sunrise,
        sunset: weather.sunset,
        feels_like: weather.feels_like,
        pressure: weather.pressure,
        visibility: weather.visibility
      })
    })
      .then(r => r.json())
      .then(d => setInsight(d.response))
      .catch(() => { })
    return () => controller.abort()
  }, [weather?.city])

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="relative z-10 bg-black/30 backdrop-blur-2xl border border-white/20 
               rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-y-auto max-h-[95vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleClose}
        className={`absolute top-6 right-6 w-9 h-9 rounded-full border border-white/30 
          bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/60 
          hover:text-white transition-all duration-300 ${closing ? 'rotate-180' : ''}`}>
        ✕
      </button>

      <button
        onClick={onToggleFav}
        className="absolute top-6 left-6 w-9 h-9 rounded-full border border-white/20
               bg-white/5 hover:bg-white/20 flex items-center justify-center
               transition-all duration-300 text-lg"
      >
        {isFav ? "⭐" : "☆"}
      </button>

      <div style={{ padding: '2rem 3.5rem' }} className="text-white flex flex-col items-center w-full gap-6">

        {/* City name — bigger, fully white */}
        <h1 className="text-6xl font-bold tracking-[0.4em] uppercase text-white text-center">
          {selectedCity}
        </h1>

        {/* Vibe — italic, visible */}
        <p className="text-2xl font-light italic text-white/80 text-center">
          {weather.vibe}
        </p>

        {/* Summary — brighter, bigger */}
        {weather.summary && (
          <p className="text-lg font-light text-white/75 text-center leading-relaxed max-w-xl">
            {weather.summary}
          </p>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-white/15" />

        {/* Stats */}
        <WeatherStats weather={weather}
          isCelsius={isCelsius}
          convertTemp={convertTemp} 
          is24Hour={is24Hour}
          formatTime={formatTime}
          />

        {/* Divider */}
        <div className="w-full h-px bg-white/15" />

        {/* AI Insight — right above forecast */}
        {insight ? (
          <div style={{ padding: '1rem 1rem' }}
            className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2 font-medium">✦ AI Insight</p>
            <p className="text-white/90 text-sm font-light leading-relaxed">{insight}</p>
          </div>
        ) : (
          <div className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
        )}

        {/* Forecast */}
        <ForecastBar forecast={forecast}
          isCelsius={isCelsius}
          convertTemp={convertTemp}
        />

      </div>
    </motion.div>
  )
}

export default WeatherModal