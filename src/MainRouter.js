import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Overview from './Components/Overview/Overview';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'
import Income from './Components/EnterIncome/Income';
import Expense from './Components/EnterExpense/Expense';
import Profile from './Components/Profile/Profile';
import PasswordReset from './Components/PasswordReset/PasswordReset';
import Expired from './Components/PasswordReset/Expired';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword'

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
                <PrivateRoute 
                exact
                path="/profile" 
                component={Profile}
                user={props.user}/>
                <Route 
                    exact 
                    path="/reset-password" 
                    render={(routerProps) =>(
                        <PasswordReset {...routerProps}/>
                    )}
                />
                <Route 
                    exact 
                    path="/forgot-password" 
                    render={(routerProps) =>(
                        <ForgotPassword
                        {...routerProps}/>
                    )}
                />
                <Route component={Expired} exact path="/expired"/>
            </>
        </Router>
    )
}

export default MainRouter
