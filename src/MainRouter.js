import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';

const MainRouter = (props) => {
    return(
        <Router>
            <Nav user={props.user} handleUserLogout = {props.handleUserLogout}/>
            <>
                <Route exact path="/signup" component={Signup}/>
                <Route 
                    exact 
                    path="/login" 
                    render={(routerProps) =>(
                        <Login {...routerProps} handleUserLogin = {props.handleUserLogin}/>
                    )}
                />
            </>
        </Router>
    )
}

export default MainRouter
