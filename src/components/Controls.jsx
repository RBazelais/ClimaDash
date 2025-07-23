import React from 'react';

const Controls = ({
	city,
	setCity,
	handleSearch,
	loading,
	tempUnit,
	setTempUnit,
	searchTerm,
	setSearchTerm,
	categoryFilter,
	setCategoryFilter,
	forecastData,
	searchInputRef, // <-- add this prop
}) => {
	return (
		<div className="controls">
		<div className="input-container">
			<input
				ref={searchInputRef} // <-- use the ref here
				type="text"
				placeholder="Enter city name..."
				value={city}
				onChange={(e) => setCity(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleSearch();
				}}
				className="city-input"
			/>
			<button
				onClick={handleSearch}
				disabled={loading || !city.trim()}
				className="search-button"
			>
				{loading ? 'Searching...' : 'Search'}
			</button>
		</div>

		<div className="filter-container">
			<select
				value={tempUnit}
				onChange={(e) => setTempUnit(e.target.value)}
				className="filter-select"
			>
				<option value="celsius">Celsius (°C)</option>
				<option value="fahrenheit">Fahrenheit (°F)</option>
			</select>
		</div>

		{forecastData.length > 0 && (
			<>
				<div className="input-container">
					<input
						type="text"
						placeholder="Search weather descriptions..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
				</div>
				<div className="filter-container">
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="filter-select"
					>
						<option value="all">All Categories</option>
						<option value="Clear">Clear</option>
						<option value="Cloud">Cloudy</option>
						<option value="Rain">Rain</option>
						<option value="Snow">Snow</option>
						<option value="Storm">Storm</option>
					</select>
				</div>
			</>
		)}
	</div>
	);
};

export default Controls;
