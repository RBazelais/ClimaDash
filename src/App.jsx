import React, { useState, useEffect } from "react";
import "./App.css";
const API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHERBIT_API_URL;

const ClimaDash = () => {
	const [forecastData, setForecastData] = useState([]);
	const [airQuality, setAirQuality] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [city, setCity] = useState("");
	const [currentCity, setCurrentCity] = useState(""); // Track the city that data was fetched for

	// Function to determine weather category based on weather code
	const getWeatherCategory = (weatherCode) => {
		if (weatherCode >= 200 && weatherCode < 300) return "Storm";
		if (weatherCode >= 300 && weatherCode < 600) return "Rain";
		if (weatherCode >= 600 && weatherCode < 700) return "Snow";
		if (weatherCode === 800) return "Clear";
		if (weatherCode > 800) return "Cloud";
		return "Unknown";
	};

	// Fetch weather forecast data
	const fetchForecastData = async (cityName) => {
		try {
			const response = await fetch(
				`${BASE_URL}/forecast/daily?city=${encodeURIComponent(cityName)}&key=${API_KEY}&days=14`,
			);

			if (!response.ok) {
				throw new Error(
					`Weather API Error: ${response.status} ${response.statusText}`,
				);
			}

			const data = await response.json();
			return data.data.map((day) => ({
				datetime: day.datetime,
				high_temp: day.high_temp,
				low_temp: day.low_temp,
				weather: {
					description: day.weather.description,
					icon: day.weather.icon,
				},
				wind_spd: day.wind_spd,
				uv: day.uv,
				rh: day.rh,
				category: getWeatherCategory(day.weather.code),
			}));
		} catch (error) {
			console.error("Error fetching forecast data:", error);
			throw error;
		}
	};

	// Fetch air quality data
	const fetchAirQualityData = async (cityName) => {
		try {
			const response = await fetch(
				`${BASE_URL}/current/airquality?city=${encodeURIComponent(cityName)}&key=${API_KEY}`,
			);

			if (!response.ok) {
				throw new Error(
					`Air Quality API Error: ${response.status} ${response.statusText}`,
				);
			}

			const data = await response.json();

			// Transform the data to match our component's expected format
			const airQualityData = data.data[0];
			return {
				aqi: airQualityData.aqi,
				co: airQualityData.co,
				no2: airQualityData.no2,
				o3: airQualityData.o3,
				pm10: airQualityData.pm10,
				pm25: airQualityData.pm25,
				so2: airQualityData.so2,
			};
		} catch (error) {
			console.error("Error fetching air quality data:", error);
			throw error;
		}
	};

	// Handle search button click or Enter key press
	const handleSearch = async () => {
		if (!API_KEY || API_KEY === "YOUR_WEATHERBIT_API_KEY") {
			setError("Please provide a valid Weatherbit API key");
			return;
		}

		if (!city || city.trim() === "") {
			setError("Please enter a valid city name");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const [forecastResult, airQualityResult] = await Promise.all([
				fetchForecastData(city.trim()),
				fetchAirQualityData(city.trim()),
			]);

			if (forecastResult.length === 0) {
				setError("No forecast data available for the entered city");
				return;
			}

			setForecastData(forecastResult);
			setAirQuality(airQualityResult);
			setCurrentCity(city.trim());
		} catch (err) {
			setError(err.message || "Failed to fetch weather data");
			console.error("Error fetching data:", err);
		} finally {
			setLoading(false);
		}
	};

	// Handle Enter key press in city input
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	// Filter data based on search and category
	const filteredData = forecastData.filter((day) => {
		const matchesSearch = day.weather.description
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || day.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	// Calculate summary statistics
	const maxTemp =
		forecastData.length > 0
			? Math.max(...forecastData.map((d) => d.high_temp))
			: 0;
	const avgHumidity =
		forecastData.length > 0
			? Math.round(
					forecastData.reduce((acc, d) => acc + d.rh, 0) /
						forecastData.length,
				)
			: 0;

	const getAQILabel = (aqi) => {
		if (aqi <= 50) return "Good";
		if (aqi <= 100) return "Moderate";
		if (aqi <= 150) return "Unhealthy for Sensitive Groups";
		if (aqi <= 200) return "Unhealthy";
		if (aqi <= 300) return "Very Unhealthy";
		return "Hazardous";
	};

	const getAQIColor = (aqi) => {
		if (aqi <= 50) return "#00e400";
		if (aqi <= 100) return "#ffff00";
		if (aqi <= 150) return "#ff7e00";
		if (aqi <= 200) return "#ff0000";
		if (aqi <= 300) return "#8f3f97";
		return "#7e0023";
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const getWeatherIcon = (iconCode) => {
		const iconMap = {
			"01d": "☀️",
			"02d": "⛅",
			"03d": "☁️",
			"04d": "☁️",
			"09d": "🌧️",
			"10d": "🌦️",
			"11d": "⛈️",
			"13d": "❄️",
			"50d": "🌫️",
		};
		return iconMap[iconCode] || "🌤️";
	};

	if (loading) {
		return (
			<div className='container'>
				<div className='loading-container'>
					<div className='spinner'></div>
					<p className='loading-text'>Loading weather data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='container'>
			<div className='sidebar'>
				<div className='logo'>
					<div className='logo-icon'>🌤️</div>
					<h1 className='logo-text'>ClimaDash</h1>
				</div>

				<nav className='nav'>
					<div className='nav-item'>
						<span className='nav-icon'>🏠</span>
						<span className='nav-text'>Dashboard</span>
					</div>
					<div className='nav-item'>
						<span className='nav-icon'>🔍</span>
						<span className='nav-text'>Search</span>
					</div>
					<div className='nav-item'>
						<span className='nav-icon'>ℹ️</span>
						<span className='nav-text'>About</span>
					</div>
				</nav>
			</div>

			<div className='main'>
				<div className='header'>
					<h2 className='header-title'>Where to next?</h2>
					{currentCity && (
						<div className='city-name'>{currentCity}</div>
					)}
				</div>

				{error && (
					<div
						className='error-container'
						style={{
							backgroundColor: "#fee",
							border: "1px solid #fcc",
							borderRadius: "4px",
							padding: "12px",
							margin: "16px 0",
							color: "#c33",
						}}
					>
						<p className='error-text'>{error}</p>
					</div>
				)}

				{forecastData.length > 0 && (
					<div className='summary-cards'>
						<div className='card'>
							<div className='card-value'>
								{maxTemp.toFixed(1)}°C
							</div>
							<div className='card-label'>Max Temperature</div>
						</div>
						<div className='card'>
							<div className='card-value'>{avgHumidity}%</div>
							<div className='card-label'>Average Humidity</div>
						</div>
						<div className='card'>
							<div
								className='card-value'
								style={{
									color: getAQIColor(airQuality?.aqi || 0),
								}}
							>
								{airQuality?.aqi || 0}
							</div>
							<div className='card-label'>
								AQI - {getAQILabel(airQuality?.aqi || 0)}
							</div>
						</div>
					</div>
				)}

				<div className='controls'>
					<div className='city-input-container'>
						<input
							type='text'
							placeholder='Enter city name...'
							value={city}
							onChange={(e) => setCity(e.target.value)}
							onKeyPress={handleKeyPress}
							className='city-input'
						/>
						<button
							onClick={handleSearch}
							disabled={loading || !city.trim()}
							className='search-button'
							style={{
								marginLeft: "8px",
								padding: "8px 16px",
								backgroundColor:
									loading || !city.trim()
										? "#ccc"
										: "#007bff",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor:
									loading || !city.trim()
										? "not-allowed"
										: "pointer",
							}}
						>
							{loading ? "Searching..." : "Search"}
						</button>
					</div>

					{forecastData.length > 0 && (
						<>
							<div className='search-container'>
								<input
									type='text'
									placeholder='Search weather descriptions...'
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className='search-input'
								/>
							</div>
							<div className='filter-container'>
								<select
									value={categoryFilter}
									onChange={(e) =>
										setCategoryFilter(e.target.value)
									}
									className='filter-select'
								>
									<option value='all'>All Categories</option>
									<option value='Clear'>Clear</option>
									<option value='Cloud'>Cloudy</option>
									<option value='Rain'>Rain</option>
									<option value='Snow'>Snow</option>
									<option value='Storm'>Storm</option>
								</select>
							</div>
						</>
					)}
				</div>

				{forecastData.length > 0 && (
					<div className='forecast-table'>
						<div className='table-header'>
							<div className='table-header-cell'>Date</div>
							<div className='table-header-cell'>High °C</div>
							<div className='table-header-cell'>Low °C</div>
							<div className='table-header-cell'>Weather</div>
							<div className='table-header-cell'>Icon</div>
							<div className='table-header-cell'>Wind m/s</div>
							<div className='table-header-cell'>UV Index</div>
						</div>

						<div className='table-body'>
							{filteredData.map((day, index) => (
								<div key={index} className='table-row'>
									<div className='table-cell'>
										{formatDate(day.datetime)}
									</div>
									<div className='table-cell'>
										{day.high_temp.toFixed(1)}°
									</div>
									<div className='table-cell'>
										{day.low_temp.toFixed(1)}°
									</div>
									<div className='table-cell'>
										{day.weather.description}
									</div>
									<div className='table-cell'>
										{getWeatherIcon(day.weather.icon)}
									</div>
									<div className='table-cell'>
										{day.wind_spd.toFixed(1)}
									</div>
									<div className='table-cell'>
										{day.uv.toFixed(1)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{forecastData.length === 0 && !loading && !error && (
					<div
						style={{
							textAlign: "center",
							padding: "40px",
							color: "#666",
						}}
					>
						<p>
							Enter a city name and click Search to get weather
							data
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ClimaDash;
