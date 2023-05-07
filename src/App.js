import './App.css';
import MainRouter from './MainRouter';
import React, {useState, useEffect} from 'react'
import jwtDecode from 'jwt-decode';
import setAxiosAuthToken from './Components/utils/setAxiosAuthToken';
require('dotenv').config();

function App() {  
  const [user, setUser] = useState(null);

  useEffect(() => {
    let currentUser = window.localStorage.getItem("jwtToken") ? jwtDecode(window.localStorage.getItem("jwtToken")) : null;
    if(currentUser && currentUser.exp > (Date.now() / 1000)){
      setUser(currentUser.email);
    }
  }, [])

  const handleUserLogin = (user) =>{
    setUser(user);
  }

  const handleUserLogout = () =>{
    setAxiosAuthToken(null)
    setUser(null)
    window.localStorage.removeItem("jwtToken")
  }
  return (
    <div className="App">
      <MainRouter handleUserLogin = {handleUserLogin} handleUserLogout = {handleUserLogout} user = {user} />
    </div>
  )
}

export default App;


