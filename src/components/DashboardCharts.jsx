import React from 'react';
import TemperatureChart from './TemperatureChart';
import PrecipitationChart from './PrecipitationChart';

const DashboardCharts = ({ forecastData }) => (
  <div className="dashboard-charts">
    <div className="chart-container">
      <h3>7-Day Temperature Forecast</h3>
      <TemperatureChart data={forecastData} />
    </div>
    <div className="chart-container">
      <h3>Precipitation Probability</h3>
      <PrecipitationChart data={forecastData} />
    </div>
  </div>
);

export default DashboardCharts;