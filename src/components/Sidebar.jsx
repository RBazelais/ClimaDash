import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ focusSearchBar, resetToDashboard }) => {
	const location = useLocation();

	const handleDashboardClick = (e) => {
		// Only reset if not already on dashboard
		if (location.pathname !== '/') {
			resetToDashboard();
		}
	};

	return (
		<div className="sidebar">
			<div className="logo">
				<span className="logo-icon">🌦️</span>
				<span className="logo-text">ClimaDashr</span>
			</div>
			<nav className="nav">
				<Link
					className="nav-item"
					to="/"
					onClick={handleDashboardClick}
				>
					<span className="nav-icon">🏠</span>
					<span className="nav-text">Dashboard</span>
				</Link>
				<button
					className="nav-item"
					onClick={() => {
						resetToDashboard();
						setTimeout(() => {
							focusSearchBar();
						}, 0);
					}}
					style={{
						background: 'none',
						border: 'none',
						color: 'inherit',
						cursor: 'pointer',
					}}
				>
					<span className="nav-icon">🔍</span>
					<span className="nav-text">Search</span>
				</button>
				<Link className="nav-item" to="/about">
					<span className="nav-icon">ℹ️</span>
					<span className="nav-text">About</span>
				</Link>
			</nav>
		</div>
	);
};

export default Sidebar;
