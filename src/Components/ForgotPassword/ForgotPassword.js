import React, {useState} from 'react'
import {toast} from 'react-toastify';
import Axios from '../utils/Axios'

function ForgotPassword(props) {
    const [email, setEmail] = useState("")

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
            toast.success('Password Reset Link has been sent to the email provided.')
            props.history.push("/login");
        }catch(e){
            console.log(e)
        }
    }
    return (
        <div className="body">
            <div className="profileContainer">
                <form onSubmit={handleResetClick}>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" value={email} onChange={handleOnChange}/>
                    <button type="submit" id="submit">Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
