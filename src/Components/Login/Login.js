import * as React from 'react';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Axios from "../utils/Axios";
import setAxiosAuthToken from "../utils/setAxiosAuthToken";
import jwtDecode from "jwt-decode";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";
import { white } from 'tailwindcss/colors';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Brutal Budget
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let isAuth = checkIfUserIsAuth();
    if (isAuth) {
      props.history.push("/overview");
    }
  }, []);

  function handleOnChange() {
    setUsername(document.querySelector("#username").value);
    setPassword(document.querySelector("#password").value);
  };

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
            Login
          </Typography>
          <Box component="form" onSubmit={handleOnSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              variant="standard"
              onChange={handleOnChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
              onChange={handleOnChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 10, backgroundColor: '#ddf1cf', color: 'black' }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='/forgot-password' variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}
/*import React, { useState, useEffect } from "react";
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
*/