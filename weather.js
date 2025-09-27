
// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const errorMessage = document.getElementById('errorMessage');

// API Key (Replace with your own API key from OpenWeatherMap)
const API_KEY = 'd4493c9c837a153d3697f5ae8e1cde55';
let currentUnit = 'metric'; // Default to Celsius

// Background images based on weather condition
const weatherBackgrounds = {
    'Clear': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Rain': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Clouds': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Thunderstorm': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Drizzle': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Snow': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Mist': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Smoke': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Haze': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Dust': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Fog': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Sand': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Ash': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Squall': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'Tornado': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70',
    'default': 'https://i0.wp.com/picjumbo.com/wp-content/uploads/sky-with-clouds-during-sunset-free-photo.jpg?w=2210&quality=70'
};

// Weather icons mapping
const weatherIcons = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-showers-heavy',
    '09n': 'fas fa-cloud-showers-heavy',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Initialize app
function initApp() {
    // Set default city
    getWeatherData('London');

    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    themeToggle.addEventListener('click', toggleTheme);
    themeToggleDesktop.addEventListener('click', toggleTheme);

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleDesktop.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Adjust UI for small screens
    adjustForScreenSize();
    window.addEventListener('resize', adjustForScreenSize);
}

// Adjust UI for different screen sizes
function adjustForScreenSize() {
    if (window.innerWidth < 480) {
        document.querySelector('.search-text').textContent = '';
    } else {
        document.querySelector('.search-text').textContent = 'Search';
    }
}

// Handle search
function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleDesktop.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggleDesktop.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Get weather data from API
async function getWeatherData(city) {
    try {
        // Show loading state
        currentWeather.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-spinner"></i> Loading weather data...
                    </div>
                `;

        forecast.innerHTML = '';

        // Hide error message
        errorMessage.style.display = 'none';

        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}`
        );

        if (!currentResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();

        // Fetch forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${API_KEY}`
        );

        const forecastData = await forecastResponse.json();

        // Update UI
        updateCurrentWeather(currentData);
        updateForecast(forecastData);

        // Change background based on weather condition
        changeBackground(currentData.weather[0].main);

    } catch (error) {
        errorMessage.style.display = 'block';
        currentWeather.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <h2>Unable to load weather data</h2>
                        <p>Please try another city</p>
                    </div>
                `;
        forecast.innerHTML = '';
    }
}

// Update current weather UI
function updateCurrentWeather(data) {
    const { name, main, weather, wind, sys, dt } = data;
    const iconCode = weather[0].icon;
    const date = new Date(dt * 1000);

    currentWeather.innerHTML = `
                <h2 class="location">${name}, ${sys.country}</h2>
                <p class="date">${formatDate(date)}</p>
                <div class="weather-info">
                    <div class="temp-container">
                        <div class="temperature">
                            ${Math.round(main.temp)}
                            <button class="unit-toggle" onclick="toggleUnit()">°${currentUnit === 'metric' ? 'C' : 'F'}</button>
                        </div>
                        <div class="weather-condition">${weather[0].description}</div>
                    </div>
                    <i class="${weatherIcons[iconCode]} weather-icon" style="font-size: 5rem;"></i>
                </div>
                <div class="weather-details">
                    <div class="detail-item">
                        <i class="fas fa-tint"></i>
                        <div class="detail-value">${main.humidity}%</div>
                        <div class="detail-label">Humidity</div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-wind"></i>
                        <div class="detail-value">${wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</div>
                        <div class="detail-label">Wind Speed</div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-temperature-low"></i>
                        <div class="detail-value">${Math.round(main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
                        <div class="detail-label">Feels Like</div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-compress-alt"></i>
                        <div class="detail-value">${main.pressure} hPa</div>
                        <div class="detail-label">Pressure</div>
                    </div>
                </div>
            `;
}

// Update forecast UI
function updateForecast(data) {
    // Filter to get one forecast per day
    const dailyForecasts = [];
    const processedDays = new Set();

    for (const forecast of data.list) {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toDateString();

        // If we haven't processed this day and it's not today
        if (!processedDays.has(dateString) && processedDays.size > 0) {
            dailyForecasts.push(forecast);
            processedDays.add(dateString);
        }

        // Add the first day (tomorrow)
        if (processedDays.size === 0) {
            dailyForecasts.push(forecast);
            processedDays.add(dateString);
        }

        // We need 5 days
        if (processedDays.size === 5) break;
    }

    // Generate HTML for forecast
    forecast.innerHTML = dailyForecasts.map(day => {
        const { dt, main, weather } = day;
        const date = new Date(dt * 1000);
        const iconCode = weather[0].icon;

        return `
                    <div class="forecast-day">
                        <div class="forecast-date">${formatDate(date, true)}</div>
                        <i class="${weatherIcons[iconCode]} forecast-icon" style="font-size: 3rem;"></i>
                        <div class="forecast-temp">${Math.round(main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
                        <div class="forecast-condition">${weather[0].description}</div>
                        <div class="forecast-details">
                            <div>H: ${Math.round(main.temp_max)}°</div>
                            <div>L: ${Math.round(main.temp_min)}°</div>
                            <div>Humidity: ${main.humidity}%</div>
                        </div>
                    </div>
                `;
    }).join('');
}

// Toggle temperature unit
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';

    // Get current city and refresh data
    const city = document.querySelector('.location').textContent.split(',')[0];
    getWeatherData(city);
}

// Change background based on weather condition
function changeBackground(condition) {
    const backgroundImage = weatherBackgrounds[condition] || weatherBackgrounds['default'];
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`;
}

// Format date
function formatDate(date, forecast = false) {
    const options = forecast
        ? { weekday: 'short', month: 'short', day: 'numeric' }
        : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('en-US', options);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
