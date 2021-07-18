import React from 'react';
import './Nav.css';
import logo from "../../local/budgetLogo.png"

function Nav() {
    return (
        <div class="navbar">
            <img src={logo}/>
            <p>Brutal Budget.</p>
        </div>
    )
}

export default Nav
