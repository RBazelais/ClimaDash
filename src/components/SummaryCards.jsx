import React from 'react';

const SummaryCards = ({
  maxTemp,
  getTempUnit,
  tempUnit,
  avgHumidity,
  airQuality,
  getAQIColor,
  getAQILabel
}) => (
  <div className="summary-cards">
    <div className="card">
      <div className="card-value">{maxTemp} {getTempUnit(tempUnit)}</div>
      <div className="card-label">Max Temperature</div>
    </div>
    <div className="card">
      <div className="card-value">{avgHumidity}%</div>
      <div className="card-label">Average Humidity</div>
    </div>
    <div className="card">
      <div className="card-value" style={{ color: getAQIColor(airQuality?.aqi || 0) }}>
        {airQuality?.aqi || 0}
      </div>
      <div className="card-label">AQI - {getAQILabel(airQuality?.aqi || 0)}</div>
    </div>
  </div>
);

export default SummaryCards;