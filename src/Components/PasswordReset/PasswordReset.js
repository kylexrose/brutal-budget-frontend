import React, {useState, useEffect} from 'react'
import {isStrongPassword} from 'validator'
import QueryString from 'query-string';
import jwt from "jsonwebtoken";
import Axios from '../utils/Axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


function PasswordReset(props) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [matchError, setMatchError] = useState("");
    const [id, setId] = useState("");


    useEffect(() => {
        const tokenObj = QueryString.parse(window.location.search);
        try{
            let decodedJwt = jwt.verify(tokenObj.token, process.env.REACT_APP_PRIVATE_JWT_KEY_RESET);
                setId(decodedJwt._id);
        }catch(e){
            props.history.push("/expired");
        }
    
    }, [])

    const handlePasswordOnChange = (event) =>{
        setPassword(event.target.value);
    };

    const handleConfirmPasswordOnChange = (event) =>{
        setConfirmPassword(event.target.value);
    }

    useEffect(() => {
        if(!isStrongPassword(password)){
                setPasswordError("Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character, and must be 8 at least characters long");
        }
    }, [password]);

    useEffect(() => {
        if(confirmPassword !== password){
                setMatchError("Passwords must match");
        }
    }, [confirmPassword]);
    
    const handleOnSubmit = async (event) =>{
        event.preventDefault();
        if(password === confirmPassword && isStrongPassword(password)){
            try{
            await Axios.put('/api/reset/password-change', {_id: id, password: password});
            props.history.push("/login")
            }catch(e){
            console.log(e)
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
              Reset Password
            </Typography>
            <Box component="form" onSubmit={handleOnSubmit} noValidate sx={{ mt: 1 }}>
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
              onChange={handlePasswordOnChange}
            />
            <TextField
              error={!!matchError}
              helperText = {matchError}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              variant="standard"
              onChange={handleConfirmPasswordOnChange}
            />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, borderRadius: 10, backgroundColor: '#ddf1cf', color: 'black' }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Container>
    )
}

export default PasswordReset
