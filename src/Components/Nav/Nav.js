import React, { Component } from 'react'
import './Nav.css';
import logo from "../../local/budgetLogo.png"
import { NavLink, Link } from 'react-router-dom';
import menu from '../../local/menuIcon.png'

export class Nav extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="menuIcon">
                    <img src={menu} alt=""/>
                </div>
                <Link to="/overview" className="logoContainer">
                    <img src={logo} alt="logo"/>
                    <p>Brutal Budget.</p>
                </Link>
                <div className="right-side-nav">
                </div>
            </div>
        )
    }
}

export default Nav
