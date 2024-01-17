<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
  
    let locationData = null;
    let error = null;
    let ipcity = null;
  
    const fetchLocationData = async () => {
      try {
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) {
          throw new Error(`Failed to fetch location data. Status: ${response.status}`);
        }
  
        locationData = await response.json();
        ipcity = locationData.city || 'FallbackCity';
        console.log(ipcity);
      } catch (err) {
        console.error('Error fetching location data:', err.message);
        error = err.message;
      }
    };
  
    fetchLocationData();
  
    let weatherData = null;
    let apiKey = '2283586530a00663438468270ae45a9f';
  
    const fetchWeatherData = async () => {
      try {
        if (ipcity) {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ipcity}&appid=${apiKey}`);
          weatherData = response.data;
          console.log(weatherData);
        } else {
          console.error('IP City not available. Skipping weather data fetch.');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
  
    onMount(() => {
      fetchWeatherData();
    });
  </script>
  
  
  
  
  <style>
    /* Add your styling here */
  </style>
  
  <main>
    {#if weatherData}
      <h1>{weatherData.name}, {weatherData.sys.country}</h1>
      <p>Temperature: {weatherData.main.temp} °C</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Wind Speed: {weatherData.wind.speed} m/s</p>
      <p>Visibility: {weatherData.visibility} meters</p>
      <p>Pressure: {weatherData.main.pressure} hPa</p>
      <!-- Add more details as needed -->
  
      <!-- Example for air quality (Note: This is just an example, you need a different API for air quality) -->
      {#if weatherData && weatherData.air_quality && weatherData.air_quality.value}
  <p>Air Quality: {weatherData.air_quality.value}</p>
{:else}
  <p>Air Quality data not available</p>
{/if}

    {:else}
      <p>Loading weather data...</p>
    {/if}
  </main>
  