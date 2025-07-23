import React from 'react';

const Header = ({ currentCity }) => (
  <div className="header">
    {currentCity && <h1 className="city-name">{currentCity}</h1>}
  </div>
);

export default Header;