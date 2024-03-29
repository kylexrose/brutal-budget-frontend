import React, { Component } from 'react'
import './Nav.css';
import logo from "../../local/budgetLogo.png"
import { NavLink, Link } from 'react-router-dom';
import menu from '../../local/menuIcon.png';

export class Nav extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="menuIcon">
                    <img src={menu} alt=""/>
                </div>
                <Link to="/overview" className="logoContainer">
                    <img className="logo" src={logo} alt="logo"/>
                </Link>
                <div className="right-side-nav">
                    <ul>
                        <li>
                        {this.props.user ? (
                            <NavLink activeClassName="selected" to="/profile">
                            Profile
                            </NavLink>
                        ) : (
                            <NavLink activeClassName="selected" to="/signup">
                            Sign up
                            </NavLink>
                        )}
                        </li>
                        <li>
                        {this.props.user ? (
                            <NavLink
                            activeStyle={{ borderBottom: "1px solid white" }}
                            to="/login"
                            onClick={this.props.handleUserLogout}
                            >
                            Logout
                            </NavLink>
                        ) : (
                            <NavLink
                            activeStyle={{ borderBottom: "1px solid white" }}
                            to="/login"
                            >
                            Login
                            </NavLink>
                        )}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Nav
