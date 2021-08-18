import React, { useState, useEffect } from 'react';
import Axios from "../utils/Axios";
import './Profile.css';
import {isEmail} from 'validator';
import {toast} from 'react-toastify';
import Confirmation from '../Confirmation/Confirmation';
import { Link } from 'react-router-dom';
import CategoryList from '../CategoryList/CategoryList';

function Profile() {

    const [userData, setUserData] = useState({});
    const [emailToggle, setEmailToggle] = useState(false);
    const [email, setEmail] = useState("");
    const [confirmToggle, setConfirmToggle] = useState(false);

    useEffect(() => {
        retrieveUserData()
    }, [])

    useEffect(() => {
        setEmail(userData.email)
    }, [userData])

    async function retrieveUserData() {
        try{
            const userData = await Axios.get(`/api/users/get-user-data`);
            setUserData(userData.data.payload)
        }catch(e){
            console.log(e)
        }
    }

    function handleEditClick() {
        setEmailToggle(!emailToggle);
    }

    async function handleSaveClick() {
        if(isEmail(email)){
            document.querySelector('#email').disabled = true;
            setConfirmToggle(true)
        }else{
            toast.error(`Email must be valid`);
            setEmailToggle(false)
        }
    }

    function handleOnChange(event) {
        setEmail(event.target.value)
    }

    async function handleSubmitPassword(password) {
        try{
            const updatedProfile = await Axios.put('/api/users/update-profile', {email: email, password: password});
            setEmail(updatedProfile.data.payload.email);
            setConfirmToggle(false);
            setEmailToggle(false)
        }catch(e){
            console.log(e)
        }
    }

    async function handleResetClick() {
        try{
            await Axios.post("/api/mailjet/reset-password", {
                firstName: userData.firstName, 
                lastName: userData.lastName,
                email : userData.email,
            });
            toast.success('Password Reset Link has been sent.')
        }catch(e){
            console.log(e)
        }
    }
    return (
        <div className="body">
            <Link className="addButton back" to="/overview">Back</Link>
            {confirmToggle ? <Confirmation handleSubmitPassword={handleSubmitPassword}/> : ""}
            <div className="profileContainer">
            <table>
                <tbody>
                    <tr className="inputBlock">
                        <td className="label">Username</td>
                        <td> {userData.username}</td>
                        <td className="button" onClick={handleResetClick}>Reset Password</td>
                    </tr>
                    {!emailToggle ? 
                    <tr className="inputBlock">
                        <td className="label">Email</td>
                        <td> {email}</td>
                        <td className="button" id="emailToggle" onClick={handleEditClick}>Change Email</td>
                    </tr> :
                    <tr className="inputBlock">
                        <td className="label">Email</td>
                        <td><input type= "text" id="email" value= {email} onChange={handleOnChange}/></td>
                        <td className="button" onClick={handleSaveClick}>Save</td>
                    </tr>}
                </tbody>
            </table>
        </div>
        <CategoryList/>
        </div>
        
    )
}

export default Profile
