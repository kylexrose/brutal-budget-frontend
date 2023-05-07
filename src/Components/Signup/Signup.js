import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, useEffect } from "react";
import { white } from 'tailwindcss/colors';
import { isAlpha, isEmail, isAlphanumeric, isStrongPassword } from "validator";
import Axios from "../utils/Axios";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";
import {Snackbar, Alert} from '@mui/material';
  
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
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [firstNameOnFocus, setFirstNameOnFocus] = useState(false);
    const [lastNameOnFocus, setLastNameOnFocus] = useState(false);
    const [emailOnFocus, setEmailOnFocus] = useState(false);
    const [usernameOnFocus, setUsernameOnFocus] = useState(false);
    const [passwordOnFocus, setPasswordOnFocus] = useState(false);
    const [alert, setAlert] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("warning");
  

    useEffect(() => {
      let isAuth = checkIfUserIsAuth();
        if (isAuth) {
          props.history.push("/overview");
        }
    }, [props.history])

    useEffect(() => {
      if(firstName.length > 0){  
        if (isAlpha(firstName)) {
          setFirstNameError("");
        } else {
          setFirstNameError('First Name must only contain letters');
        }
      }else if(firstNameOnFocus){
        setFirstNameError('First Name can not be empty');
      }
    }, [firstName, firstNameOnFocus]);

    useEffect(() => {
      if(lastName.length > 0){  
        if (isAlpha(lastName)) {
          setLastNameError("");
        } else {
          setLastNameError('Last Name must only contain letters');
        }
      }else if(lastNameOnFocus){
        setLastNameError('Last Name can not be empty');
      }
    }, [lastName, lastNameOnFocus]);

    useEffect(() => {
      if (username.length > 0) {
        if (isAlphanumeric(username)) {
          setUsernameError("");
        } else {
          setUsernameError("Username can only be alphanumeric.")
        }
      } else if(usernameOnFocus){
        setUsernameError("Username cannot be empty")
      }
    }, [username, usernameOnFocus]);

    useEffect(() => {
      if (email.length > 0) {
        if (isEmail(email)) {
          setEmailError("")
        } else {
          setEmailError("Please enter a valid email");
        }
      } else if(emailOnFocus){
        setEmailError("Email cannot be empty");
      }
    }, [email, emailOnFocus]);
    
    useEffect(() => {
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
    }, [password, passwordOnFocus])
    
    useEffect(() => {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match")
    } else {
        setConfirmPasswordError("");
    }
    }, [confirmPassword, password])

    async function handleOnChange(e) {
      const {name, value} = e.target;
      switch(name){
        case('firstName'):{
          setFirstName(`${value}`)
          break;
        }
        case('lastName'):{
          setLastName(`${value}`)
          break;
        }
        case('username'):{
          setUsername(`${value}`)
          break;
        }
        case('email'):{
          setEmail(`${value}`)
          break;
        }
        case('password'):{
          setPassword(`${value}`)
          break;
        }
        case('confirmPassword'):{
          setConfirmPassword(`${value}`)
          break;
        }
        default: break;
      }
    };

    async function handleOnFocus(e) {
      const {name, value} = e.target;
      switch(name){
        case('firstName'):{
          setFirstNameOnFocus(`${value}`)
          break;
        }
        case('lastName'):{
          setLastNameOnFocus(`${value}`)
          break;
        }
        case('username'):{
          setUsernameOnFocus(`${value}`)
          break;
        }
        case('email'):{
          setEmailOnFocus(`${value}`)
          break;
        }
        case('password'):{
          setPasswordOnFocus(`${value}`)
          break;
        }
        default: break;
      }
    };

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
        setAlert('User successfully created');
        setAlertSeverity('success');
        props.history.push("/login");
      }catch(e){
        console.log(e.response);
        setAlert(`${e.response.data.message}`)
        setAlertSeverity('error');
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
        <Snackbar
        open={!!alert}
        onClose={() => {
            setAlert("")
            setAlertSeverity("warning")}}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
        >
            <Alert severity={alertSeverity}>
                {alert}
            </Alert>
        </Snackbar>
      </Container>
  );
  }
  
  export default Signup
