import React, {useState} from 'react'

import Axios from '../utils/Axios'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Snackbar, Alert} from '@mui/material';


function ForgotPassword(props) {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("warning");

    function handleOnChange(e){
        setEmail(e.target.value)
    }

    async function handleResetClick(e) {
        e.preventDefault();
        try{
            const getUserInfo = await Axios.post("api/users/get-user-by-email", {email: email});
            await Axios.post("/api/mailjet/reset-password", {
                firstName: getUserInfo.data.firstName, 
                lastName: getUserInfo.data.lastName,
                email : email,
            });
            setAlert('An email has been sent to the address provided.')
            setAlertSeverity('success');
            props.history.push('/login')
        }catch(e){
            console.log(e)
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
              Forgot Password
            </Typography>
            <Box component="form" onSubmit={handleResetClick} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                variant="standard"
                onChange={handleOnChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, borderRadius: 10, backgroundColor: '#ddf1cf', color: 'black' }}
              >
                Reset Password
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
    )
}

export default ForgotPassword
