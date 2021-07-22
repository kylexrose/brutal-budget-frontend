import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Overview from './Components/Overview/Overview';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'
import Income from './Components/EnterIncome/Income';
import Expense from './Components/EnterExpense/Expense';

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
                <PrivateRoute 
                exact
                path="/overview" 
                component={Overview}
                user={props.user}/>
                <PrivateRoute 
                exact
                path="/add-income" 
                component={Income}
                user={props.user}/>
                <PrivateRoute 
                exact
                path="/add-expense" 
                component={Expense}
                user={props.user}/>
            </>
        </Router>
    )
}

export default MainRouter
