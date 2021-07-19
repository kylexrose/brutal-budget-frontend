import './App.css';
import MainRouter from './MainRouter';
import { ToastContainer } from 'react-toastify';
import React, {Component} from 'react'
import jwtDecode from 'jwt-decode';
import setAxiosAuthToken from './Components/utils/setAxiosAuthToken';

export class App extends Component {
  state = {
    user: null,
  };
  componentDidMount(){
    let currentUser = window.localStorage.getItem("jwtToken") ? jwtDecode(window.localStorage.getItem("jwtToken")) : null;
    if(currentUser && currentUser.exp > (Date.now() / 1000))
      {this.setState({
        user: {
          email: currentUser.email,
        }
      })}
  }

  handleUserLogin = (user) =>{
    this.setState({
      user: user
    })
  }

  handleUserLogout = () =>{
    setAxiosAuthToken(null)
    this.setState({
      user: null
    })
    window.localStorage.removeItem("jwtToken")
  }

  render(){
  return (
    <div className="App">
      <ToastContainer position="top-center"/> 
      <MainRouter handleUserLogin = {this.handleUserLogin} handleUserLogout = {this.handleUserLogout} user = {this.state.user}/>
    </div>
  );
}
}

export default App;
