function VibeCard({vibe, city}){

    return(
        <div className="bg-gray-900 bg-transparent text-white flex flex-col items-center pt-20">
            <span className="text-s uppercase font-white/70 text-center"> {city}</span>
            <h1 className="text-3xl items-center">{vibe}</h1>
        </div>

    )
}

export default VibeCard