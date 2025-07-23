import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import About from './components/About';
import SummaryCards from './components/SummaryCards';
import Controls from './components/Controls';
import DashboardCharts from './components/DashboardCharts';
import ForecastTable from './components/ForecastTable';
import DetailPanel from './components/DetailPanel';
import {
    convertTemp,
    getTempUnit,
    formatDate,
    formatTime,
    getWeatherIcon,
    getMoonPhase,
    getWindDirection,
} from './utils/weatherUtils';
import {
    fetchForecastData,
    fetchAirQualityData,
    fetchHourlyData,
} from './api/weatherApi';
import './App.css';

const App = () => {
    const { cityName, date } = useParams();
    const [forecastData, setForecastData] = useState([]);
    const [airQuality, setAirQuality] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [city, setCity] = useState(cityName || '');
    const [currentCity, setCurrentCity] = useState(cityName || '');
    const [tempUnit, setTempUnit] = useState('celsius');
    const [selectedDay, setSelectedDay] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const searchInputRef = useRef(null);

    const handleFetchCityData = useCallback(async (name) => {
        try {
            setLoading(true);
            setError(null);
            const [forecastResult, airQualityResult] = await Promise.all([
                fetchForecastData(name),
                fetchAirQualityData(name),
            ]);
            if (forecastResult.length === 0) {
                setError('No forecast data available for the entered city');
                setForecastData([]);
                setAirQuality(null);
                setCurrentCity('');
                return;
            }
            setForecastData(forecastResult);
            setAirQuality(airQualityResult);
            setCurrentCity(name);
        } catch (err) {
            setError(err.message || 'Failed to fetch weather data');
            setForecastData([]);
            setAirQuality(null);
            setCurrentCity('');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (cityName) {
            setCity(cityName);
            handleFetchCityData(cityName);
        }
        // No default fetch if no cityName
    }, [cityName, handleFetchCityData]);

    useEffect(() => {
        if (date && forecastData.length > 0) {
            const day = forecastData.find((d) => d.datetime === date);
            if (day) {
                setSelectedDay(day);
                (async () => {
                    const hourly = await fetchHourlyData(currentCity, day.datetime);
                    setHourlyData(hourly);
                })();
            }
        }
    }, [date, forecastData, currentCity]);

    const handleSearch = async () => {
        const trimmedCity = city.trim();
        if (!trimmedCity) {
            setError('Please enter a valid city name');
            return;
        }
        await handleFetchCityData(trimmedCity);
        navigate(`/city/${encodeURIComponent(trimmedCity)}`);
    };

    const handleDaySelect = async (day) => {
        setSelectedDay(day);
        navigate(`/city/${encodeURIComponent(currentCity)}/day/${day.datetime}`);
        try {
            const hourly = await fetchHourlyData(currentCity, day.datetime);
            setHourlyData(hourly);
        } catch {
            setHourlyData([]);
        }
    };

    const filteredData = forecastData.filter((day) => {
        const matchesSearch = day.weather.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === 'all' || day.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const maxTemp =
        forecastData.length > 0
            ? Math.max(...forecastData.map((d) => convertTemp(d.high_temp, tempUnit)))
            : 0;

    const avgHumidity =
        forecastData.length > 0
            ? Math.round(
                    forecastData.reduce((acc, d) => acc + d.rh, 0) / forecastData.length,
                )
            : 0;

    const getAQILabel = (aqi) => {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    };

    const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
    };

    const focusSearchBar = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const resetToDashboard = () => {
        setSelectedDay(null);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading weather data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Sidebar focusSearchBar={focusSearchBar} resetToDashboard={resetToDashboard} />
            <div className="main">
                {location.pathname === '/about' ? (
                    <>
                        <Header currentCity={currentCity} />
                        <About />
                    </>
                ) : selectedDay ? (
                    <DetailPanel
                        selectedDay={selectedDay}
                        hourlyData={hourlyData}
                        setSelectedDay={setSelectedDay}
                        navigate={navigate}
                        currentCity={currentCity}
                        forecastData={forecastData}
                        convertTemp={(temp) => convertTemp(temp, tempUnit)}
                        getTempUnit={() => getTempUnit(tempUnit)}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getMoonPhase={getMoonPhase}
                        getWeatherIcon={getWeatherIcon}
                        getWindDirection={getWindDirection}
                    />
                ) : forecastData.length === 0 ? (
                    <>
                        <Controls
                            city={city}
                            setCity={setCity}
                            handleSearch={handleSearch}
                            loading={loading}
                            tempUnit={tempUnit}
                            setTempUnit={setTempUnit}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            forecastData={forecastData}
                            searchInputRef={searchInputRef}
                        />
                        <div className="empty-state">
                            <p>Enter a city name and click Search to get weather data</p>
                        </div>
                    </>
                ) : (
                    <>
                        <Header currentCity={currentCity} />
                        {error && (
                            <div className="error-container">
                                <p className="error-text">{error}</p>
                            </div>
                        )}
                        <SummaryCards
                            forecastData={forecastData}
                            maxTemp={maxTemp}
                            avgHumidity={avgHumidity}
                            airQuality={airQuality}
                            getTempUnit={getTempUnit}
                            tempUnit={tempUnit}
                            getAQIColor={getAQIColor}
                            getAQILabel={getAQILabel}
                        />
                        <Controls
                            city={city}
                            setCity={setCity}
                            handleSearch={handleSearch}
                            loading={loading}
                            tempUnit={tempUnit}
                            setTempUnit={setTempUnit}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            forecastData={forecastData}
                            searchInputRef={searchInputRef}
                        />
                        <ForecastTable
                            filteredData={filteredData}
                            selectedDay={selectedDay}
                            handleDaySelect={handleDaySelect}
                            convertTemp={convertTemp}
                            getTempUnit={() => getTempUnit(tempUnit)}
                            getWeatherIcon={getWeatherIcon}
                            formatDate={formatDate}
                            tempUnit={tempUnit}
                        />
                        {forecastData.length > 0 && (
                            <DashboardCharts forecastData={forecastData} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default App;
