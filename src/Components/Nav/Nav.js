import React, { Component } from 'react'
import './Nav.css';
import logo from "../../local/budgetLogo.png"

export class Nav extends Component {
    render() {
        return (
            <div className="navbar">
            <img src={logo} alt="logo"/>
            <p>Brutal Budget.</p>
        </div>
        )
    }
}

export default Nav
