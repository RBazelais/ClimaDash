import React from 'react';

const ForecastTable = ({
	filteredData,
	selectedDay,
	handleDaySelect,
	convertTemp,
	getTempUnit,
	getWeatherIcon,
	formatDate,
	tempUnit,
}) => (
	<div className="forecast-table">
		<div className="table-header">
			<div className="table-header-cell">Date</div>
			<div className="table-header-cell">High {getTempUnit()}</div>
			<div className="table-header-cell">Low {getTempUnit()}</div>
			<div className="table-header-cell">Weather</div>
			<div className="table-header-cell">Icon</div>
			<div className="table-header-cell">Wind m/s</div>
			<div className="table-header-cell">UV Index</div>
		</div>
		<div className="table-body">
			{filteredData.map((day, index) => (
				<div
					key={index}
					className={`table-row${selectedDay?.datetime === day.datetime ? ' selected' : ''}`}
					onClick={() => handleDaySelect(day)}
					style={{ cursor: 'pointer' }}
				>
					<div className="table-cell">{formatDate(day.datetime)}</div>
					<div className="table-cell">
						{convertTemp(day.high_temp, tempUnit)}{getTempUnit()}
					</div>
					<div className="table-cell">
						{convertTemp(day.low_temp, tempUnit)}{getTempUnit()}
					</div>
					<div className="table-cell">{day.weather.description}</div>
					<div className="table-cell">
						{getWeatherIcon(day.weather.icon)}
					</div>
					<div className="table-cell">
						{Math.round(day.wind_spd)} m/s
					</div>
					<div className="table-cell">{Math.round(day.uv)}</div>
				</div>
			))}
		</div>
	</div>
);

export default ForecastTable;
