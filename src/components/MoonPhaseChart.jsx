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

const MoonPhaseChart = ({ data }) => {
	const labels = data.map((day) => day.datetime);
	const moonPhases = data.map((day) => day.moon_phase_lunation);

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Moon Phases',
				data: moonPhases,
				borderColor: 'rgba(255, 206, 86, 1)',
				backgroundColor: 'rgba(255, 206, 86, 0.2)',
				fill: true,
				tension: 0.3,
				pointRadius: 3,
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
			y: {
				title: { display: true, text: 'Moon Phase' },
				min: 0,
				max: 1,
				ticks: {
					stepSize: 0.125,
					callback: (value) => {
						if (value === 0) return '🌑 New Moon';
						if (value === 0.125) return '🌒 Waxing Crescent';
						if (value === 0.25) return '🌓 First Quarter';
						if (value === 0.375) return '🌔 Waxing Gibbous';
						if (value === 0.5) return '🌕 Full Moon';
						if (value === 0.625) return '🌖 Waning Gibbous';
						if (value === 0.75) return '🌗 Third Quarter';
						if (value === 0.875) return '🌘 Waning Crescent';
						if (value === 1) return '🌑 New Moon';
						return '';
					},
				},
			},
		},
	};

	return <Line data={chartData} options={options} />;
};

export default MoonPhaseChart;
