import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import setAxiosAuthToken from "../utils/setAxiosAuthToken";
import jwtDecode from "jwt-decode";
import checkIfUserIsAuth from "../utils/checkIfUserIsAuth";
import {Snackbar, Alert} from '@mui/material';



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
  const [alert, setAlert] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("warning");

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
        setAlert('Login Successful');
        setAlertSeverity('success');
        props.history.push("/overview");
    }catch(e){
      console.log(e)
      if(e.response.status === 400){
        setAlert('`Login Unsuccessful, check username and/or password')
        setAlertSeverity('error')
      }else{
        setAlert('Too many requests being made');
        setAlertSeverity('error');
      }
    }
  }

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
            background: 'white',
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