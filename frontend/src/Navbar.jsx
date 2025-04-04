import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {/* Additional navigation links can be added here */}
    </nav>
  );
}

export default Navbar;

