import React from 'react';

const HourlyWeatherTable = ({
	hourlyData,
	convertTemp,
	getTempUnit,
	getWeatherIcon,
	getWindDirection,
	tempUnit, // <-- add this prop
}) => (
	<div>
		<h3>Hourly Forecast</h3>
		<table className="hourly-table" style={{ width: '100%' }}>
			<thead>
				<tr>
					<th>Time</th>
					<th>Temp</th>
					<th>Icon</th>
					<th>Precip %</th>
					<th>Wind</th>
				</tr>
			</thead>
			<tbody>
				{hourlyData
					.filter(
						(hour) =>
							hour &&
							hour.datetime &&
							hour.temp !== undefined &&
							hour.weather &&
							hour.weather.icon
					)
					.map((hour, idx) => (
						<tr key={idx}>
							<td>
								{new Date(hour.datetime * 1000).toLocaleTimeString([], {
									hour: 'numeric',
									hour12: true,
								})}
							</td>
							<td>
								{convertTemp(hour.temp, tempUnit)}
								{getTempUnit()}
							</td>
							<td>{getWeatherIcon(hour.weather.icon)}</td>
							<td>{hour.pop}%</td>
							<td>
								{Math.round(hour.wind_spd)} m/s{' '}
								{getWindDirection(hour.wind_dir)}
							</td>
						</tr>
					))}
			</tbody>
		</table>
	</div>
);

export default HourlyWeatherTable;
