  import React, { Component } from "react";
  import { ToastContainer, toast } from "react-toastify";
  import 'react-toastify/dist/ReactToastify.css';
  import { isAlpha, isEmail, isAlphanumeric, isStrongPassword } from "validator";
  import Axios from "../utils/Axios";
  import "./Signup.css";
  import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";
  
  function Signup(props) {
    state = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstNameError: "",
      lastNameError: "",
      usernameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      isButtonDisabled: true,
      firstNameOnFocus: false,
      lastNameOnFocus: false,
      emailOnFocus: false,
      usernameOnFocus: false,
      passwordOnFocus: false,
      confirmPasswordOnFocus: false,
      toastError: true,
    };

    
  
    componentDidMount() {
        let isAuth = checkIfUserIsAuth();
        if (isAuth) {
          this.props.history.push("/overview");
        }
    }
  
    handleOnChange = (event) => {
      this.setState(
        {
          [event.target.name]: event.target.value,
        },
        () => {
          if (
            event.target.name === "firstName" ||
            event.target.name === "lastName"
          ) {
            this.handleFirstNameAndLastNameInput(event);
          }
          if (event.target.name === "email") {
            this.handleEmailInput();
          }
          if (event.target.name === "username") {
            this.handleUsernameInput();
          }
          if (event.target.name === "password") {
            this.handlePasswordInput();
          }
          if (event.target.name === "confirmPassword") {
            this.handleConfirmPasswordInput();
          }
        }
      );
    };
    
    handleConfirmPasswordInput = () => {
      if (this.state.password !== this.state.confirmPassword) {
        this.setState({
          confirmPasswordError: "Password does not match!",
          isButtonDisabled: true,
        });
      } else {
        this.setState({
          confirmPasswordError: "",
        });
      }
    };
    handlePasswordInput = () => {
      if (this.state.confirmPasswordOnFocus) {
        if (this.state.password !== this.state.confirmPassword) {
          this.setState({
            confirmPasswordError: "Password does not match",
            isButtonDisabled: true,
          });
        } else {
          this.setState({
            confirmPasswordError: "",
          });
        }
      }
      if (this.state.password.length === 0) {
        this.setState({
          passwordError: "Password cannot be empty",
          isButtonDisabled: true,
        });
      } else {
        if (isStrongPassword(this.state.password)) {
          this.setState({
            passwordError: "",
          });
        } else {
          this.setState({
            passwordError:
              "Password must contains 1 uppercase, 1 lowercase, 1 special character, 1 number and minimum of 8 characters long",
            isButtonDisabled: true,
          });
        }
      }
    };
    handleEmailInput = () => {
      if (this.state.email.length === 0) {
        this.setState({
          emailError: "Email cannot be empty",
          isButtonDisabled: true,
        });
      } else {
        if (isEmail(this.state.email)) {
          this.setState({
            emailError: "",
          });
        } else {
          this.setState({
            emailError: "Please, enter a valid email!",
            isButtonDisabled: true,
          });
        }
      }
    };
    handleFirstNameAndLastNameInput = (event) => {
      if (this.state[event.target.name].length > 0) {
        if (isAlpha(this.state[event.target.name])) {
          this.setState({
            [`${event.target.name}Error`]: "",
          });
        } else {
          this.setState({
            [`${event.target.name}Error`]: `${event.target.placeholder} can only have alphabet`,
            isButtonDisabled: true,
          });
        }
      } else {
        this.setState({
          [`${event.target.name}Error`]: `${event.target.placeholder} cannot be empty`,
          isButtonDisabled: true,
        });
      }
    };
    handleUsernameInput = () => {
      if (this.state.username.length === 0) {
        this.setState({
          usernameError: "Username cannot be empty",
          isButtonDisabled: true,
        });
      } else {
        if (isAlphanumeric(this.state.username)) {
          this.setState({
            usernameError: "",
          });
        } else {
          this.setState({
            usernameError: "Username can only be alphanumeric.",
            isButtonDisabled: true,
          });
        }
      }
    };
    handleOnSubmit = async (event) => {
      event.preventDefault();
      try{
        let userInputObj = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
        }
        await Axios.post('/api/users/signup', userInputObj);
        toast.success("User successfully created")
        props.history.push("/login");
      }catch(e){
        console.log(e.response)
        toast.error(`${e.response.data.message}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        console.log(e.message)
      }
    };
    handleOnBlur = (event) => {
      if (this.state[event.target.name].length === 0) {
        this.setState({
          [`${event.target.name}Error`]: `${event.target.placeholder} cannot be empty`,
        });
      }
    };
    componentDidUpdate(prevProps, prevState) {
      if (prevState.isButtonDisabled === true) {
        if (
          this.state.firstNameOnFocus &&
          this.state.lastNameOnFocus &&
          this.state.emailOnFocus &&
          this.state.usernameOnFocus &&
          this.state.passwordOnFocus &&
          this.state.confirmPasswordOnFocus
        ) {
          if (
            this.state.firstNameError.length === 0 &&
            this.state.lastNameError.length === 0 &&
            this.state.usernameError.length === 0 &&
            this.state.emailError.length === 0 &&
            this.state.passwordError.length === 0 &&
            this.state.confirmPasswordError.length === 0 &&
            this.state.password === this.state.confirmPassword
          ) {
            this.setState({
              isButtonDisabled: false,
            });
          }
        }
      }
    }
    handleInputOnFocus = (event) => {
      if (!this.state[`${event.target.name}OnFocus`]) {
        this.setState({
          [`${event.target.name}OnFocus`]: true,
        });
      }
    };
  render() {
    const {firstNameError, lastNameError, emailError, usernameError, passwordError, confirmPasswordError,} = this.state;
    return (
      <div className="container">
        <div className="form-text">Sign-up</div>
        <div className="form-div">
          <form className="form" onSubmit={this.handleOnSubmit}>
            <div className="block-container">
              <input
                  type="firstName"
                  id="firstName"
                  placeholder="First Name"
                  name="firstName"
                  onChange={this.handleOnChange}
              />
              <input
                  type="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={this.handleOnChange}
              />
              <div className="errorMessage">{firstNameError && lastNameError}</div>
            </div>
            <div className="block-container"></div>
              <input
                    type="username"
                    id="username"
                    placeholder="Username"
                    name="username"
                    onChange={this.handleOnChange}
              />
              <div className="errorMessage">{usernameError}</div>
            <div className="block-container">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  name="password"
                  onChange={this.handleOnChange}
                />
                <div className="errorMessage">{passwordError}</div>
            </div>
            <div className="block-container">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={this.handleOnChange}
                />
                <div className="errorMessage">{confirmPasswordError}</div>
            </div>
            <div className="block-container">
              <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                  onChange={this.handleOnChange}
              />
              <div className="errorMessage">{emailError}</div>
            </div>
            <div className="button-container">
              <button type="submit">
                Create Profile
              </button>
            </div>
          </form>
        </div>
        <ToastContainer/>
      </div>
    )
  }
}

export default Signup
