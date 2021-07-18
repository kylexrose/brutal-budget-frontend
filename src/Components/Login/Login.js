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
    email: "",
    password: "",
    loginError: "",
    isButtonDisabled: true,
    toastError: true,
  };

  componentDidMount() {
    let isAuth = checkIfUserIsAuth();
    if (isAuth) {
      this.props.history.push("/movie");
    }
  }

  handleOnChange = ()=>{
    this.setState({
        email : document.querySelector("#email").value,
        password : document.querySelector("#password").value,
    }, ()=>{
        if(this.state.email && this.state.password){
        this.setState({
            isButtonDisabled : false,
        })
    }else{
        this.setState({
            isButtonDisabled : true,
        })
    }
    })
  }
  
  handleOnSubmit = async(event) =>{
    event.preventDefault();
    try{
        const success = await Axios.post('/api/user/login', {
            email : this.state.email,
            password : this.state.password
        })
        let jwtToken = success.data.payload;

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
        this.props.history.push("/movie");
    }catch(e){
      console.log(e)
      if(e.response.status === 400){

        
        toast.error(`Login Unsuccessful, check email and/or password`, {
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
      const {isButtonDisabled} = this.state;
    return (
      <div className="container">
        <div className="form-text">Login</div>
        <div className="form-div">
          <form className="form" onSubmit={this.handleOnSubmit}>
            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                  onChange={this.handleOnChange}
                />
              </div>
            </div>
            <div className="form-group-block">
              <div className="block-container">
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  id="password"
                  placeholder="Password"
                  name="password"
                  onChange={this.handleOnChange}
                />
              </div>
            </div>
            <div className="button-container">
              <button type="submit" disabled={isButtonDisabled}>
                Submit
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