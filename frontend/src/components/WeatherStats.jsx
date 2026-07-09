import React from 'react';

const AQI_MAP = {
    1: {label: "Good", color: "text-green-400"},
    2: {label: "Fair", color: "text-yellow-400"},
    3: {label: "Moderate", color: "text-orange-400"},
    4: {label: "Poor", color: "text-red-400"},
    5: {label: "Hazardous", color: "text-purple-400"}
}

const WeatherStats = ({ weather, isCelsius, convertTemp, is24Hour, formatTime }) => {
    if (!weather) return null
    const aqiInfo = AQI_MAP[weather.aqi] || { label: "Unknown", color: "text-gray-400" }

    const card = "bg-black/20 rounded-2xl p-5 text-center"
    const lbl  = "text-white/40 text-xs uppercase tracking-widest mb-2"
    const val  = "text-2xl font-bold text-white"

    return (
        <div className="flex flex-col gap-4 w-full px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Temperature", value: `${convertTemp(weather.temperature, isCelsius)}°${isCelsius ? 'C' : 'F'}` },
                    { label: "Humidity", value: `${weather.humidity}%` },
                    { label: "Wind Speed", value: `${weather.wind_speed} m/s` },
                    { label: "AQI", value: aqiInfo.label, color: aqiInfo.color },
                ].map((stat) => (
                    <div key={stat.label} className={card}>
                        <p className={lbl}>{stat.label}</p>
                        <p className={`${val} ${stat.color ?? ""}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Local Time", value: formatTime(weather.local_time, is24Hour )},
                    { label: "UV Index", value: Math.round(weather.uv_index) },
                    { label: "Sunrise", value: formatTime(weather.sunrise, is24Hour) },
                    { label: "Sunset", value: formatTime(weather.sunset, is24Hour )},
                ].map((stat) => (
                    <div key={stat.label} className={card}>
                        <p className={lbl}>{stat.label}</p>
                        <p className={val}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Feels Like", value: `${convertTemp(weather.temperature, isCelsius)}°${isCelsius ? 'C' : 'F'}` },
                    { label: "Pressure", value: `${weather.pressure} hPa` },
                    { label: "Visibility", value: `${weather.visibility / 1000} km` },
                ].map((stat) => (
                    <div key={stat.label} className={card}>
                        <p className={lbl}>{stat.label}</p>
                        <p className={val}>{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherStats;