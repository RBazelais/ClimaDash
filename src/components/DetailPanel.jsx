import React from 'react';
import MoonPhaseChart from './MoonPhaseChart';
import HourlyWeatherTable from './HourlyWeatherTable';
import { formatTimeWithTimezone } from '../utils/weatherUtils';

const DetailPanel = ({
    selectedDay,
    hourlyData,
    setSelectedDay,
    navigate,
    currentCity,
    forecastData,
    convertTemp,
    getTempUnit,
    formatDate,
    getMoonPhase,
    getWeatherIcon,
    getWindDirection,
}) => {
    if (!selectedDay) return null;

    return (
        <div className="detail-panel">
            <div className="detail-header">
                <h2>Detailed Weather for {formatDate(selectedDay.datetime)}</h2>
                <button
                    className="close-detail"
                    onClick={() => {
                        setSelectedDay(null);
                        navigate(`/city/${encodeURIComponent(currentCity)}`);
                    }}
                >
                    ×
                </button>
            </div>
            <div className="detail-main">
                <div className="detail-hourly">
                    <HourlyWeatherTable
                        hourlyData={hourlyData}
                        convertTemp={convertTemp}
                        getTempUnit={getTempUnit}
                        getWeatherIcon={getWeatherIcon}
                        getWindDirection={getWindDirection}
                    />
                </div>
                <div className="detail-astronomy">
                    <h3>Astronomy</h3>
                    <div className="detail-item">
                        <span className="detail-label">Moon Phase: </span>
                        <span className="detail-value">
                            {getMoonPhase(selectedDay.moon_phase_lunation)}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Sunrise: </span>
                        <span className="detail-value">
                            {formatTimeWithTimezone(selectedDay.sunrise_ts, selectedDay.timezone)}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Sunset: </span>
                        <span className="detail-value">
                            {formatTimeWithTimezone(selectedDay.sunset_ts, selectedDay.timezone)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="detail-chart">
                <MoonPhaseChart data={forecastData} />
            </div>
        </div>
    );
};

export default DetailPanel;
