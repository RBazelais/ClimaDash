import React from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from 'chart.js';

Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
);

const TemperatureChart = ({ data }) => {
	const labels = data.map((day) => day.datetime);
	const highTemps = data.map((day) => day.high_temp);
	const lowTemps = data.map((day) => day.low_temp);

	const chartData = {
		labels,
		datasets: [
			{
				label: 'High Temp (°C)',
				data: highTemps,
				borderColor: 'rgba(255, 99, 132, 1)',
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				fill: false,
				tension: 0.3,
			},
			{
				label: 'Low Temp (°C)',
				data: lowTemps,
				borderColor: 'rgba(54, 162, 235, 1)',
				backgroundColor: 'rgba(54, 162, 235, 0.2)',
				fill: false,
				tension: 0.3,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: 'top' },
			tooltip: { mode: 'index', intersect: false },
		},
		scales: {
			x: { title: { display: true, text: 'Date' } },
			y: { title: { display: true, text: 'Temperature (°C)' } },
		},
	};

	return <Line data={chartData} options={options} />;
};

export default TemperatureChart;
