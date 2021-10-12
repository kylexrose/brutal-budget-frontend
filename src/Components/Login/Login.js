import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Axios from "../utils/Axios";
import setAxiosAuthToken from "../utils/setAxiosAuthToken";
import "./Login.css";
import jwtDecode from "jwt-decode";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";
import {Link} from 'react-router-dom'


function Login(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let isAuth = checkIfUserIsAuth();
    if (isAuth) {
      props.history.push("/overview");
    }
  }, [])

  function handleOnChange() {
    setUsername(document.querySelector("#username").value);
    setPassword(document.querySelector("#password").value);
  }
  
  async function handleOnSubmit(event) {
    event.preventDefault();
    try{
        const loginCred = {
          username : username,
          password : password
        }
        const success = await Axios.post('/api/users/login', loginCred)
        let jwtToken = success.data.payload;
        setAxiosAuthToken(jwtToken)
        let decodedToken = jwtDecode(jwtToken)
        props.handleUserLogin(decodedToken)
        window.localStorage.setItem('jwtToken', success.data.payload);
        toast.success(`Login Successful`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        props.history.push("/overview");
    }catch(e){
      console.log(e)
      if(e.response.status === 400){
        toast.error(`Login Unsuccessful, check username and/or password`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
    })
    }else{
    toast.error(`Too many requests being made`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
})
}}}
  return (
    <div className="container">
      <div className="form-text">Login</div>
      <div className="form-div">
        <form className="form" onSubmit= {handleOnSubmit}>
          <div className="block-container">
            <input
                type="username"
                id="username"
                placeholder="Username"
                name="username"
                onChange={handleOnChange}
            />
          </div>
          <div className="block-container">
              <input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                onChange={handleOnChange}
              />
          </div>
          <div className="button-container">
            <button type="submit">
              Login
            </button>
            <Link style={{color:"blue", textDecoration: "underline"}} to='/forgot-password'>Forgot Password</Link>
          </div>
          
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Login