export const convertTemp = (tempCelsius, tempUnit = 'celsius') => {
	if (tempUnit === 'fahrenheit') {
		return Math.round((tempCelsius * 9) / 5 + 32);
	}
	return Math.round(tempCelsius);
};

export const getTempUnit = (tempUnit = 'celsius') =>
	tempUnit === 'fahrenheit' ? '°F' : '°C';

export const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	});
};

export const formatTime = (timestamp) => {
	const date = new Date(timestamp * 1000);
	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const formatTimeWithTimezone = (timestamp, timeZone, options = {}) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone,
        ...options,
    });
};

export const getWeatherIcon = (iconCode) => {
	const iconMap = {
        "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️", "03d": "☁️", "03n": "☁️",
        "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
        "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️", "50d": "🌫️", "50n": "🌫️",
        "a01d": "☀️", "a01n": "🌙", "a02d": "⛅", "a02n": "☁️", "a03d": "☁️", "a03n": "☁️",
        "a04d": "☁️", "a04n": "☁️", "a05d": "🌫️", "a05n": "🌫️", "a06d": "🌫️", "a06n": "🌫️",
        "c01d": "☀️", "c01n": "🌙", "c02d": "⛅", "c02n": "☁️", "c03d": "☁️", "c03n": "☁️",
        "c04d": "☁️", "c04n": "☁️", "d01d": "🌧️", "d01n": "🌧️", "d02d": "🌧️", "d02n": "🌧️",
        "d03d": "🌧️", "d03n": "🌧️", "f01d": "❄️", "f01n": "❄️", "r01d": "🌦️", "r01n": "🌧️",
        "r02d": "🌦️", "r02n": "🌧️", "r03d": "🌧️", "r03n": "🌧️", "r04d": "🌧️", "r04n": "🌧️",
        "r05d": "🌧️", "r05n": "🌧️", "r06d": "🌧️", "r06n": "🌧️", "s01d": "❄️", "s01n": "❄️",
        "s02d": "❄️", "s02n": "❄️", "s03d": "❄️", "s03n": "❄️", "s04d": "❄️", "s04n": "❄️",
        "s05d": "❄️", "s05n": "❄️", "s06d": "❄️", "s06n": "❄️", "t01d": "⛈️", "t01n": "⛈️",
        "t02d": "⛈️", "t02n": "⛈️", "t03d": "⛈️", "t03n": "⛈️", "t04d": "⛈️", "t04n": "⛈️",
        "t05d": "⛈️", "t05n": "⛈️"
    };
	return iconMap[iconCode] || '🌤️';
};

export const getMoonPhase = (lunation) => {
	if (lunation === 0 || lunation === 1) return 'New Moon';
	if (lunation < 0.25) return 'Waxing Crescent';
	if (lunation === 0.25) return 'First Quarter';
	if (lunation < 0.5) return 'Waxing Gibbous';
	if (lunation === 0.5) return 'Full Moon';
	if (lunation < 0.75) return 'Waning Gibbous';
	if (lunation === 0.75) return 'Last Quarter';
	return 'Waning Crescent';
};

export const getWindDirection = (degrees) => {
	const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
	const index = Math.round((degrees % 360) / 45) % 8;
	return directions[index];
};
