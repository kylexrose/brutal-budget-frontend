import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Axios from "../utils/Axios";
import setAxiosAuthToken from "../utils/setAxiosAuthToken";
import "./Login.css";
import jwtDecode from "jwt-decode";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";

export class Login extends Component {

  render() {
    return (
      <div className="container">
        <div className="form-text">Login</div>
        <div className="form-div">
          <form className="form">
              <div className="block-container">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                  onChange={this.handleOnChange}
                />
            </div>
              <div className="block-container">
                <input
                  type="text"
                  id="password"
                  placeholder="Password"
                  name="password"
                />
            </div>
            <div className="button-container">
              <button type="submit">
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