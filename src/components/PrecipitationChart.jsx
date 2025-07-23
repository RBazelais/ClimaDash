import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
	Chart,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend,
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PrecipitationChart = ({ data }) => {
	const labels = data.map((day) => day.datetime);
	const precipitation = data.map((day) => day.pop); // pop = probability of precipitation (%)

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Precipitation Probability (%)',
				data: precipitation,
				backgroundColor: 'rgba(54, 162, 235, 0.6)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
			tooltip: { mode: 'index', intersect: false },
		},
		scales: {
			x: { title: { display: true, text: 'Date' } },
			y: {
				title: { display: true, text: 'Precipitation Probability (%)' },
				min: 0,
				max: 100,
			},
		},
	};

	return <Bar data={chartData} options={options} />;
};

export default PrecipitationChart;
