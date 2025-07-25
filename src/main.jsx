import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/city/:cityName" element={<App />} />
				<Route path="/city/:cityName/day/:date" element={<App />} />
				<Route path="/about" element={<App />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);