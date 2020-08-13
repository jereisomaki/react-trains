import React, { useState } from 'react';
import '../styles/header.css';
//import logo from '../images/logo.png';
import { AiOutlineSearch } from 'react-icons/ai'

const Header = (props) => {

    const [search, setSearch] = useState("");

    // Activate search when pressing Enter
    const keyPress = (e) => {
        if (e.key === 'Enter') {
            props.setSearchID(search);
        }
    }

    return (
        <div className="header">
            <div className="map-logo">React Trains</div>
            <div className="search-box">
                <input 
                    type="text" 
                    className="search-input" 
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => keyPress(e)}
                    placeholder="Train number"
                />
                <AiOutlineSearch className="search-icon" onClick={() => {
                    props.setSearchID(search);
                }}/>
            </div>
        </div>
    );
}

export default Header;