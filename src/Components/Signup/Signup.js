import * as React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, useEffect } from "react";
import { white } from 'tailwindcss/colors';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { isAlpha, isEmail, isAlphanumeric, isStrongPassword } from "validator";
import Axios from "../utils/Axios";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";
import { toBeDisabled } from '@testing-library/jest-dom/dist/matchers';
  
  function Signup(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [firstNameOnFocus, setFirstNameOnFocus] = useState(false);
    const [lastNameOnFocus, setLastNameOnFocus] = useState(false);
    const [emailOnFocus, setEmailOnFocus] = useState(false);
    const [usernameOnFocus, setUsernameOnFocus] = useState(false);
    const [passwordOnFocus, setPasswordOnFocus] = useState(false);
    const [confirmPasswordOnFocus, setConfirmPasswordOnFocus] = useState(false);
    const [toastError, setToastError] = useState(true);
  

    useEffect(() => {
      let isAuth = checkIfUserIsAuth();
        if (isAuth) {
          props.history.push("/overview");
        }
    }, [])

    useEffect(() => {
      handleFirstNameInput();
      disableButton();
    }, [firstName]);

    useEffect(() => {
      handleLastNameInput();
      disableButton();
    }, [lastName]);

    useEffect(() => {
      handleUsernameInput();
      disableButton();
    }, [username]);

    useEffect(() => {
      handleEmailInput();
      disableButton();
    }, [email]);
    
    useEffect(() => {
      handlePasswordInput();
      disableButton();
    }, [password])
    
    useEffect(() => {
      handleConfirmPasswordInput();
      console.log(confirmPasswordError)
      disableButton();
    }, [confirmPassword])

    async function handleOnChange(e) {
      const funcStr = `set${capitalizeFirstLetter(e.target.name)}('${e.target.value}')`;
      await eval(funcStr);
    };

    async function handleOnFocus(e) {
      const funcStr = `set${capitalizeFirstLetter(e.target.name)}OnFocus('true')`;
      await eval(funcStr);
    };

    function capitalizeFirstLetter(str){
      const splitString = str.split('');
      splitString[0] = splitString[0].toUpperCase();
      return splitString.join('');
    }
    
    const handleFirstNameInput = () => {
      if(firstName.length > 0){  
        if (isAlpha(firstName)) {
          setFirstNameError("");
        } else {
          setFirstNameError('First Name must only contain letters');
        }
      }else if(firstNameOnFocus){
        setFirstNameError('First Name can not be empty');
      }
    };

    const handleLastNameInput = () => {
      if(lastName.length > 0){  
        if (isAlpha(lastName)) {
          setLastNameError("");
        } else {
          setLastNameError('Last Name must only contain letters');
        }
      }else if(lastNameOnFocus){
        setLastNameError('Last Name can not be empty');
      }
    };
    
    const handleUsernameInput = () => {
      if (username.length > 0) {
        if (isAlphanumeric(username)) {
          setUsernameError("");
        } else {
          setUsernameError("Username can only be alphanumeric.")
        }
      } else if(usernameOnFocus){
        setUsernameError("Username cannot be empty")
      }
    };
    
    const handleEmailInput = () => {
      if (email.length > 0) {
        if (isEmail(email)) {
          setEmailError("")
        } else {
          setEmailError("Please enter a valid email");
        }
      } else if(emailOnFocus){
        setEmailError("Email cannot be empty");
      }
    };
    
    const handlePasswordInput = () => {
      if (password.length > 0) {
        if (isStrongPassword(password)) {
            setPasswordError("");
        } else {
            setPasswordError(
            "Password must contain 1 uppercase, 1 lowercase, 1 special character, 1 number and minimum of 8 characters long"
            )
        }
      } else if(passwordOnFocus){
          setPasswordError("Password cannot be empty");
      }
    };
    
    const handleConfirmPasswordInput = () => {
      if (password !== confirmPassword) {
          setConfirmPasswordError("Passwords do not match")
      } else {
          setConfirmPasswordError("");
      }
    };

    function disableButton(){
      if(!!firstNameError || !!lastNameError || !!usernameError || !!emailError || !!passwordError || !!confirmPasswordError){
        setIsButtonDisabled(true)
      }else{
        setIsButtonDisabled(false)
      }
    }

    const handleOnSubmit = async (event) => {
      event.preventDefault();
      try{
        let userInputObj = {
          firstName,
          lastName,
          email,
          username,
          password,
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

    return (
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 5,
            borderRadius: 5,
            background: white,
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleOnSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              error={!!firstNameError}
              helperText = {firstNameError}
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="firstName"
              variant="standard"
              onFocus={handleOnFocus}
              onChange={handleOnChange}
            />
            <TextField
              error={!!lastNameError}
              helperText = {lastNameError}
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lastName"
              variant="standard"
              onFocus={handleOnFocus}
              onChange={handleOnChange}
            />
            <TextField
              error={!!usernameError}
              helperText = {usernameError}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              variant="standard"
              onFocus={handleOnFocus}
              onChange={handleOnChange}
            />
            <TextField
              error={!!emailError}
              helperText = {emailError}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              variant="standard"
              onFocus={handleOnFocus}
              onChange={handleOnChange}
            />
            <TextField
              error={!!passwordError}
              helperText = {passwordError}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
              onFocus={handleOnFocus}
              onChange={handleOnChange}
            />
            <TextField
              error={!!confirmPasswordError}
              helperText = {confirmPasswordError}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              variant="standard"
              onFocus={handleOnFocus}
              onChange={handleOnChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 10, backgroundColor: '#ddf1cf', color: 'black' }}
              disabled={!!firstNameError || !!lastNameError || !!usernameError || !!emailError || !!passwordError || !!confirmPasswordError}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Container>
  );
  }
  
  export default Signup
  /*import React, { Component } from "react";
  import { ToastContainer, toast } from "react-toastify";
  import 'react-toastify/dist/ReactToastify.css';
  import { isAlpha, isEmail, isAlphanumeric, isStrongPassword } from "validator";
  import Axios from "../utils/Axios";
  import "./Signup.css";
  import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";
  
  export class Signup extends Component {
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
        this.props.history.push("/login");
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
*/