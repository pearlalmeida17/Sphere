function getConditionIcon(condition) {
  const icons = {
    Clear: "☀️", Clouds: "☁️", Rain: "🌧️",
    Drizzle: "🌦️", Thunderstorm: "⛈️", Snow: "❄️",
    Mist: "🌫️", Haze: "🌫️", Fog: "🌫️", Smoke: "🌫️"
  }
  return icons[condition] ?? "🌡️"
}

function getCardBg(condition, is_day) {
  const colors = {
    Clear:        is_day ? "rgba(255,140,50,0.25)"  : "rgba(10,10,60,0.35)",
    Clouds:       is_day ? "rgba(100,120,140,0.25)" : "rgba(20,30,60,0.35)",
    Rain:         is_day ? "rgba(40,80,140,0.25)"   : "rgba(10,25,60,0.35)",
    Drizzle:      is_day ? "rgba(60,100,160,0.25)"  : "rgba(20,40,80,0.35)",
    Thunderstorm: is_day ? "rgba(50,20,100,0.25)"   : "rgba(15,5,40,0.35)",
    Snow:         is_day ? "rgba(200,210,230,0.20)" : "rgba(30,35,80,0.35)",
    Mist:         is_day ? "rgba(150,170,180,0.20)" : "rgba(20,35,50,0.35)",
    Haze:         is_day ? "rgba(180,140,60,0.25)"  : "rgba(40,30,10,0.35)",
    Smoke:        is_day ? "rgba(90,60,40,0.25)"    : "rgba(25,15,10,0.35)",
  }
  return colors[condition] ?? "rgba(255,255,255,0.05)"
}

function CityCard({ cityName, temperature, condition, is_day, onClick }) {
  return (
    <div
  onClick={onClick}
  className="cursor-pointer rounded-2xl flex flex-col justify-between h-36 w-40
             relative overflow-hidden group
             backdrop-blur-xl border border-white/20
             transition-all duration-500 hover:-translate-y-2 hover:scale-105
             hover:border-white/40 hover:bg-white/10
             shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]
             active:scale-95"
  style={{ background: getCardBg(condition, is_day) }}
>
  <div style={{ padding: '1rem 1rem' }} className="relative z-10 p-4 flex flex-col justify-between h-full">

    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">{condition}</p>
        <p className="font-medium text-base text-white leading-tight">{cityName}</p>
      </div>
      <span className="text-xl">{getConditionIcon(condition)}</span>
    </div>

    <p className="text-4xl font-extralight text-white">{temperature}°</p>
  </div>
</div>
  )
}

export default CityCard