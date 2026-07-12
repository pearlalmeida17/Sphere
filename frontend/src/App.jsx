import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, MessageCircle, Save } from "lucide-react"
import useWeather from "./hooks/useWeather"
import VibeCard from "./components/VibeCard"
import Background from "./components/Background"
import WeatherModal from "./components/WeatherModal"
import CityGrid from "./components/CityGrid"
import WeatherChat from "./components/WeatherChat"
import CityCard from "./components/CityCard"


function App() {
  const [city, setCity] = useState("")
  const { weather, forecast, loading, error, fetchWeather } = useWeather()
  const [selectedCity, setSelectedCity] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])


  const [pastCities, setPastCities] = useState(() => {
    const saved = localStorage.getItem("pastCities")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("pastCities", JSON.stringify(pastCities))
  }, [pastCities])

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") != "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark", isDark)
  }), [isDark]

  const [isCelsius, setIsCelsius] = useState(() => {
    return localStorage.getItem("tempUnit") !== "false"
  })

  useEffect(() => {
    localStorage.setItem("tempUnit", isCelsius)
  }), [isCelsius]

  const [favCities, setFavCities] = useState(() => {
    const saved = localStorage.getItem("favCities")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("favCities", JSON.stringify(favCities))
  }, [favCities])


  useEffect(() =>{
    
    if (pastCities.length > 0) return

    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) =>{
        const { latitude, longitude} = position.coords

        try{
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        )
        
        const data = await res.json()

        if (data && data[0]?.name) {
          const detectedCity = data[0].name
          const weatherData = await fetchWeather(detectedCity)
          if (weatherData){
            setPastCities(prev => [
              {
                city: weatherData.city,
                temperature: Math.round(weatherData.temperature),
                condition: weatherData.weather_condition,
                is_day: weatherData.is_day
              },
              ...prev
            ].slice(0, 10))
          }
        }
      }catch (err){
        console.error("Geolocation fetch failed:", err)
      }
      }, 
      (err) =>{
        console.log("Geolocation denied:", err.message)
      },
      { timeout: 8000}
    )
  }, [])


  const [is24Hour, setIs24Hour] = useState(() => {
    return localStorage.getItem("timeFormat") !== "false"
  })

  useEffect(() => {
    localStorage.setItem("timeFormat", is24Hour)
  }, [is24Hour])

  function formatTime(timeStr, is24Hour) {
  if (!timeStr) return timeStr
  const [hours, minutes] = timeStr.split(":").map(Number)
  if (is24Hour) return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  const period = hours >= 12 ? "PM" : "AM"
  const h = hours % 12 || 12
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`
}

  function toggleFav(cityObj) {
    setFavCities(prev =>
      prev.find(c => c.city === cityObj.city)
        ? prev.filter(c => c.city !== cityObj.city)
        : [cityObj, ...prev].slice(0, 8)
    )
  }

  function isFav(cityName) {
    return favCities.some(c => c.city === cityName)
  }

  function convertTemp(temp, isCelsius) {
    if (isCelsius) return Math.round(temp)
    return Math.round((temp * 9 / 5) + 32)
  }

  async function handleSearch() {
    if (!city) return
    const data = await fetchWeather(city)

    if (!data) return

    setPastCities(prev => [
      { city: data.city, temperature: Math.round(data.temperature), condition: data.weather_condition, is_day: data.is_day },
      ...prev.filter(c => c.city !== data.city)
    ].slice(0, 10))
    setSelectedCity(data.city)
    setCity("")

  }

  async function handleCityClick(cityName) {
    const data = await fetchWeather(cityName)
    setSelectedCity(data.city)
  }

  useEffect(() => {
    document.body.style.overflow = (selectedCity || isChatOpen) ? "hidden" : "auto"
  }, [selectedCity, isChatOpen])

  useEffect(() => {
    if (pastCities.length === 0) return 

    const interval = setInterval(async () => {
      const latestCity = pastCities[0].city
      const data = await fetchWeather(latestCity)
      if (data) {
        setPastCities(prev => [
          {
            city: data.city,
            temperature: Math.round(data.temperature),
            condition: data.weather_condition,
            is_day: day.is_day
          },
          ...prev.filter(c => c.city !== data.city)
        ].slice(0, 10))
      }
    }, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [pastCities.length])

  return (

    <div className="relative min-h-screen bg-transparent overflow-hidden font-sans selection:bg-white/20">

      <button
        onClick={() => setIsDark(prev => !prev)}
        className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full 
                  bg-white/10 backdrop-blur-md border border-white/20
                  flex items-center justify-center
                  hover:bgwhite/20 transition-all duration-300"

      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <button
        onClick={() => setIsCelsius(prev => !prev)}
        style={{ padding: '1rem 1rem' }}
        className="fixed top-6 right-20 z-50 h-10 px-4 rounded-full
                  bg-white/10 backdrop-blur-md border border-white/20
                  flex items-center justify-center
                  hover:bg-white/20 transition-all duration-300
                  text-white text-sm font-medium tracking-wide"

      >
        {isCelsius ? "°C" : "°F"}

      </button>
      <button 
        onClick={() => setIs24Hour(prev => !prev)}
        style={{ padding: '1rem 1rem' }}
        className="fixed top-6 right-36 z-50 h-10 px-4 rounded-full
        bg-white/10 backdrop-blur-md border border-white/20
        flex items-center justify-center
        hover:bg-white/20 transition-all duration-300
        text-white text-xs font-medium tracking-wide"
      >
          {is24Hour ? "24H" : "12H"}
      </button>

      <div className="min-h-screen bg-transparent text-white flex flex-col items-center  transition-all duration-1000">
        {<Background condition={weather?.weather_condition} is_day={weather?.is_day ?? true} isDark={isDark} />}

        <motion.main
          animate={{
            scale: (selectedCity || isChatOpen) ? 0.95 : 1,
            filter: (selectedCity || isChatOpen) ? "blur(10px)" : "blur(0px)",
            opacity: (selectedCity || isChatOpen) ? 0.6 : 1
          }}

          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center  px-6 min-h-screen w-full max-w-6xl mx-auto gap-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ padding: '1.5rem 4.5rem' }}
            className="text-center mb-12 w-full flex flex-col items-center gap-6"
          >

            <motion.h1
              className="text-7xl md:text-9xl font-extralight tracking-tighter opacity-90 leading-none cursor-default"
              style={{ letterSpacing: '-0.03em' }}
            >
              {"Sphère".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    y: -8,
                    scale: 1.15,
                    opacity: 1,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{ display: 'inline-block', cursor: 'default' }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <p className="text-xs tracking-[0.5em] text-white/40 uppercase">Weather & Atmosphere</p>


            <div

              className="relative w-full max-w-xl group">
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full group-focus-within:bg-white/10 transition-all duration-500" />
              <div
                style={{ padding: '0.5rem 0.5rem', margin: '0 1rem' }}
                className=" relative flex justify-between  bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-4  transition-all duration-300 focus-within:border-white/30">
                <Search
                  className="w-5 h-5 text-white/30 mr-3" />
                <div className="relative w-full max-w-sm">
                  <input

                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search for a city..."
                    className="w-90 bg-transparent text-white placeholder-white/30 outline-none flex-1 text-sm tracking-wider pl-2 "
                  />
                </div>
                <button onClick={handleSearch} className=" p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowRight className="w-6 h-6 text-white/60" />
                </button>

              </div>
            </div>

          </motion.div>

          {loading && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/70 animate-spin" />
              </div>
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase">Reading the Atmosphere</p>
            </div>
          )}
          {error && <p className="text-red-400">{error}</p>}

          {pastCities.length > 0 && (
            <div className="flex justify-between items-center w-full max-w-5xl px-6 mb-2">
              <p className="text-white/30 text-xs uppercase tracking-widest">Recent</p>
              <button
                onClick={() => {
                  setPastCities([])
                  localStorage.removeItem("pastCities")
                }}
                className="text-white/30 text-xs uppercase tracking-widest hover:text-white/60 transition-colors duration-300"
              >
                Clear All
              </button>
            </div>
          )}

          {favCities.length > 0 && (
            <div className="w-full flex flex-col items-center gap-3 px-6">
              <div className="flex justify-between items-center w-full max-w-5xl">
                <p className="text-white/30 text-xs uppercase tracking-widest">⭐ Favourites</p>
              </div>
              <div className="flex gap-3 justify-center flex-wrap max-w-5xl mx-auto">
                {favCities.map((item) => (
                  <motion.div
                    key={item.city}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CityCard
                      cityName={item.city}
                      temperature={convertTemp(item.temperature, isCelsius)}
                      condition={item.condition}
                      is_day={item.is_day}
                      onClick={() => handleCityClick(item.city)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          
          {favCities.length > 0 && pastCities.length > 0 && (
            <div className="w-full max-w-5xl h-px bg-white/10 mx-auto" />
          )}


          <AnimatePresence mode="wait">

            {pastCities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center mt-8 gap-3 px-6"
              >
                {/* Split cities into 2 equal rows */}
                {[
                  pastCities.slice(0, Math.ceil(pastCities.length / 2)),
                  pastCities.slice(Math.ceil(pastCities.length / 2))
                ].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-3 justify-center">
                    {row.map((item) => (
                      <motion.div
                        key={item.city}
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <CityCard
                          cityName={item.city}
                          temperature={convertTemp(item.temperature, isCelsius)}
                          condition={item.condition}
                          is_day={item.is_day}
                          onClick={() => handleCityClick(item.city)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        <AnimatePresence>
          {selectedCity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                onClick={() => setSelectedCity("")}
              />
              <WeatherModal
                weather={weather}
                selectedCity={selectedCity}
                onClose={() => setSelectedCity("")}
                forecast={forecast}
                isCelsius={isCelsius}
                convertTemp={convertTemp}
                isFav={isFav(selectedCity)}
                is24Hour={is24Hour}
                formatTime={formatTime}
                onToggleFav={() => toggleFav({
                  city: weather.city,
                  temperature: weather.temperature,
                  condition: weather.weather_condition,
                  is_day: weather.is_day
                })}
              />
            </div>
          )}
        </AnimatePresence>

        <WeatherChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          weather={weather}
          forecast={forecast}
          messages={messages}
          onSendMessage={(msg) => setMessages(prev => [...prev, msg])}
          isCelsius={isCelsius}
        />

        {!isChatOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 z-50 p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 active:scale-95 transition-all"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}

      </div>
    </div>

  )
}



export default App