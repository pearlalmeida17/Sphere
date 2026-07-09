import { MessageCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"


function WeatherChat({ isOpen, onClose, onOpen, weather, forecast, messages, onSendMessage }) {

    const [input, setInput] = useState("")
    const bottomRef = useRef(null)

    const [closing, setClosing] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    function handleClose() {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            onClose()
        }, 300)
    }


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    async function handleSend() {
        if (!input.trim()) return
        if (!weather) return
        onSendMessage({ role: "user", content: input })
        setInput("")
        setIsTyping(true)


        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: input,
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
                visibility: weather.visibility,
                forecast: forecast 
            })
        })

        const data = await response.json()
        setIsTyping(false)
        onSendMessage({ role: "ai", content: data.response })

    }

    return (
        <div className={`fixed top-0 right-0 h-full z-50  w-100 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

            {isOpen ? (
                <div className="bg-black/40 text-white flex flex-col w-100 backdrop-blur-2xl border-l border-white/10 h-full shadow-2xl">

                    <div style={{ padding: '2.5rem 3.5rem' }}
                        className="relative flex justify-center items-center px-10 py-8 border-b border-white/10">
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-white">
                                Sphère
                            </h1>
                            <p className="text-lg text-white/30 mt-1">{weather ? `Ask about ${weather.city}` : 'Search a city first'}</p>
                        </div>
                        <button

                            onClick={handleClose}
                            className={`absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 ${closing ? 'rotate-90' : ''}`} >
                            ✕
                        </button>
                    </div>
                    <div
                        style={{ padding: '2.5rem 3.5rem' }}
                        className=" flex  flex-col text-lg flex-1 overflow-y-auto p-4  gap-2 chat-scrollbar">
                        
                        <div className="flex-1"/>
                        {messages.map((msg, index) => (
                            <div key={index}
                                style={{ padding: '0.5rem 0.5rem' }}
                                className={`text-lg p-3 rounded-xl max-w-[80%]
                            ${msg.role === "user"
                                        ? "bg-blue-500 text-white rounded-[20px] rounded-br-sm px-4 py-2 max-w-[75%] self-end text-sm"
                                        : "bg-white/15 text-white rounded-[20px] rounded-bl-sm px-4 py-2 max-w-[75%] self-start text-sm"

                                    }
                        `}>
                                {msg.content}
                            </div>

                        ))}

                        {isTyping && (
                            <div className="bg-white/15 rounded-[20px] rounded-bl-sm px-4 py-3 max-w-[75%] self-start flex gap-1 items-center">
                                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div  >
                    <div style={{ padding: '1.5rem 1.5rem' }}
                        className="flex  gap-3 p-6  border-white/10">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask Anything..."
                            style={{ padding: '1rem 1.5rem' }}
                            className="flex-1 bg-white/10 text-white text-lg px-5 py-4 rounded-xl outline-none placeholder-white/30 focus:bg-white/15 transition-colors"
                        />
                        <button
                            style={{ padding: '2rem 1.5rem' }}
                            onClick={handleSend}
                            className=" bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-4 rounded-xl text-white text-lg transition-colors ">
                            →
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={onOpen} className="fixed bottom-8 right-8 p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 active:scale-95 transition-all">
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

        </div>
    )
}

export default WeatherChat