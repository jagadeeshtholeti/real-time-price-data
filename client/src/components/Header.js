import React from 'react';
import { FaList, FaInfoCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
const Header = () => {
    return (
        <header className='cmp-header'>
            <NavLink to='/'><h1 className='cmp-header__logo'>Real Stocks Price Tracker</h1></NavLink>
            <nav className='cmp-header__menu'>
                <ul>
                    <li><NavLink to='/viewstocks'><FaList /> Stocks List</NavLink></li>
                    <li><NavLink to='/about'><FaInfoCircle /> About Us</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}
export default React.memo(Header);