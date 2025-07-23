const API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHERBIT_API_URL;

function getWeatherCategory(weatherCode) {
	if (weatherCode >= 200 && weatherCode < 300) return 'Storm';
	if (weatherCode >= 300 && weatherCode < 600) return 'Rain';
	if (weatherCode >= 600 && weatherCode < 700) return 'Snow';
	if (weatherCode === 800) return 'Clear';
	if (weatherCode > 800) return 'Cloud';
	return 'Unknown';
}

export async function fetchForecastData(cityName) {
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
			temp: day.temp,
			app_max_temp: day.app_max_temp,
			app_min_temp: day.app_min_temp,
			precip: day.precip,
			snow: day.snow,
			snow_depth: day.snow_depth,
			pres: day.pres,
			slp: day.slp,
			dewpt: day.dewpt,
			clouds: day.clouds,
			vis: day.vis,
			solar_rad: day.solar_rad,
			wind_spd: day.wind_spd,
			wind_dir: day.wind_dir,
			wind_cdir: day.wind_cdir,
			wind_cdir_full: day.wind_cdir_full,
			pop: day.pop,
			ozone: day.ozone,
			weather: {
				code: day.weather.code,
				description: day.weather.description,
				icon: day.weather.icon,
			},
			uv: day.uv,
			rh: day.rh,
			sunrise_ts: day.sunrise_ts,
			sunset_ts: day.sunset_ts,
			moon_phase: day.moon_phase,
			moon_phase_lunation: day.moon_phase_lunation,
			moonrise_ts: day.moonrise_ts,
			moonset_ts: day.moonset_ts,
			category: getWeatherCategory(day.weather.code),
		}));
	} catch (error) {
		console.error('Error fetching forecast data:', error);
		throw error;
	}
}

export async function fetchAirQualityData(cityName) {
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
		console.error('Error fetching air quality data:', error);
		throw error;
	}
}

export async function fetchHourlyData(cityName, date) {
	try {
		const response = await fetch(
			`${BASE_URL}/forecast/hourly?city=${encodeURIComponent(cityName)}&key=${API_KEY}`,
		);
		if (!response.ok) {
			throw new Error(
				`Hourly API Error: ${response.status} ${response.statusText}`,
			);
		}
		const data = await response.json();
		return data.data
			.filter((hour) => hour.datetime.startsWith(date))
			.map((hour) => ({
				datetime: hour.datetime,
				temp: hour.temp,
				app_temp: hour.app_temp,
				weather: {
					description: hour.weather.description,
					icon: hour.weather.icon,
				},
				wind_spd: hour.wind_spd,
				wind_dir: hour.wind_dir,
				wind_cdir: hour.wind_cdir,
				pop: hour.pop,
				precip: hour.precip,
				snow: hour.snow,
				rh: hour.rh,
				clouds: hour.clouds,
				vis: hour.vis,
				uv: hour.uv,
			}));
	} catch (error) {
		console.error('Error fetching hourly data:', error);
		return [];
	}
}
