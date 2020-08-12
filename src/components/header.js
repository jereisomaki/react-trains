import React from 'react';
import '../styles/header.css';
import logo from '../images/logo.png';
import { AiOutlineSearch } from 'react-icons/ai'

const Header = () => {

  return (
      <div className="header">
          <div className="map-logo"><img src={logo} width="150px"/></div>
          <div className="search-box">
              <input type="text" className="search-input" placeholder="Enter train number..."/>
              <AiOutlineSearch className="search-icon"/>
          </div>
      </div>
  );
}

export default Header;