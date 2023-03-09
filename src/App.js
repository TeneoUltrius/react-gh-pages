import React from 'react';
import WeatherWidget from './WeatherWidget';
import MyComponent from './MyComponent';
import './App.css';

function App() {
  return (
      <div className="App">
        <h1>Weather Widget v0.01</h1>
        <WeatherWidget />
        <MyComponent />
      </div>
  );
}

export default App;
