import CityCard from "./CityCard"

function CityGrid({pastCities, onCityClick}){
    return(
        <div className="grid grid-cols md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
            {pastCities?.map(cityObj => (
                <CityCard
                    key={cityObj.city}
                    cityName = {cityObj.city}
                    temperature={cityObj.temperature}
                    condition={cityObj.condition}
                    is_day={cityObj.is_day}
                    onClick ={() => onCityClick(cityObj.city) }
                />
            ))}

        </div>
    )
}

export default CityGrid