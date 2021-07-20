import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Axios from "../utils/Axios";
import setAxiosAuthToken from "../utils/setAxiosAuthToken";
import "./Login.css";
import jwtDecode from "jwt-decode";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";

export class Login extends Component {
  state = {
    username: "",
    password: "",
    loginError: "",
    toastError: true,
  };

  componentDidMount() {
    let isAuth = checkIfUserIsAuth();
    if (isAuth) {
      this.props.history.push("/");
    }
  }

  handleOnChange = ()=>{
    this.setState({
        username : document.querySelector("#username").value,
        password : document.querySelector("#password").value,
    });
  }
  
  handleOnSubmit = async(event) =>{
    event.preventDefault();
    try{
        const loginCred = {
          username : this.state.username,
          password : this.state.password
        }
        const success = await Axios.post('/api/users/login', loginCred)
        let jwtToken = success.data.payload;
        console.log(success)
        setAxiosAuthToken(jwtToken)
        let decodedToken = jwtDecode(jwtToken)
        console.log(decodedToken)
        this.props.handleUserLogin(decodedToken)
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
        this.props.history.push("/");
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
  render() {
    return (
      <div className="container">
        <div className="form-text">Login</div>
        <div className="form-div">
          <form className="form" onSubmit= {this.handleOnSubmit}>
            <div className="block-container">
              <input
                  type="username"
                  id="username"
                  placeholder="Username"
                  name="username"
                  onChange={this.handleOnChange}
              />
            </div>
            <div className="block-container">
                <input
                  type="text"
                  id="password"
                  placeholder="Password"
                  name="password"
                  onChange={this.handleOnChange}
                />
            </div>
            <div className="button-container">
              <button type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
        <ToastContainer/>
      </div>
    );
  }
}
export default Login;