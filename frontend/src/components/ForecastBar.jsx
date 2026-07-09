import React from 'react';

function getConditionIcon(condition) {
    const icons = {
        Clear: "☀️", Clouds: "☁️", Rain: "🌧️",
        Drizzle: "🌦️", Thunderstorm: "⛈️", Snow: "❄️",
        Mist: "🌫️", Haze: "🌫️", Fog: "🌫️"
    }
    return icons[condition] ?? "🌡️"
}

const ForecastRow = ({ forecast, isCelsius, convertTemp }) => {
    // If forecast hasn't loaded yet, return null to avoid errors
    if (!forecast) return null;

    return (
        <div className="flex gap-3 w-full overflow-x-auto pb-2 px-2">
            {forecast.map((day, index) => (
                <div key={index} className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 
  rounded-2xl p-4 text-center min-w-20 flex flex-col items-center gap-1 
  hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">

                    <p className="text-sm font-bold text-white uppercase tracking-widest">{day.day}</p>
                    <span className="text-2xl my-1">{getConditionIcon(day.condition)}</span>
                    <p className="text-xs text-white/50">{day.condition}</p>
                    <div className="flex gap-1 items-baseline mt-1">
                        <span className="text-base font-bold text-white">{convertTemp(day.max, isCelsius)}°</span>
                        <span className="text-sm text-white/40">{convertTemp(day.min, isCelsius)}°°</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ForecastRow;