import React, { useState } from 'react';
import axios from 'axios';

function WeatherWidget() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const API_KEY = '1c10f865692eb67b929aea80571d569a'

    const handleInputChange = (event) => {
        setCity(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            setWeather(response.data);
        } catch (error) {
            console.error(error);
        }
    };  

    return (
        <div className="weather-widget">
            <form onSubmit={handleFormSubmit}>
                <label>
                    Enter city name:
                    <input type="text" value={city} onChange={handleInputChange} />
                </label>
                <button type="submit">Search</button>
            </form>
            {weather && (
                <div>
                    <h2>{weather.name}</h2>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                </div>
            )}
        </div>
    );
}

export default WeatherWidget;