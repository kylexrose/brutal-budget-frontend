import React, { Component } from 'react';
import Axios from "../utils/Axios";
import './Profile.css';
import {isEmail} from 'validator';
import {toast} from 'react-toastify';
import Confirmation from '../Confirmation/Confirmation';

export class Profile extends Component {
    state = {
        userData : {},
        emailToggle: false,
        email: "",
        confirmToggle: false,
    }

    componentDidMount(){
        this.retrieveUserData()
    }

    retrieveUserData = async () =>{
        try{
            const userData = await Axios.get(`/api/users/get-user-data`);
            this.setState({
                userData: userData.data.payload,
            }, () =>{
                this.setState({
                    email : this.state.userData.email,
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    handleEditClick = (event) =>{
        this.setState({
            [event.target.id] : !this.state[event.target.id],
        })
    }

    handleSaveClick = async () =>{
        if(isEmail(this.state.email)){
            document.querySelector('#email').disabled = true;
            this.setState({
                confirmToggle: true,
            })
        }else{
            toast.error(`Email must be valid`);
            this.setState({
                emailToggle: false,
            })
        }
    }

    handleOnChange = (event)=>{
        this.setState({
            [event.target.id] : event.target.value,
        })
    }

    handleSubmitPassword = async(password)=>{
        try{
            const updatedProfile = await Axios.put('/api/users/update-profile', {email: this.state.email, password: password});
            console.log(updatedProfile)
            this.setState({
                email: updatedProfile.email,
                confirmToggle: false,
                emailToggle: false,
            })

        }catch(e){
            console.log(e)
        }
    }

    render() {
        return (
            <div className="body">
                {this.state.confirmToggle ? <Confirmation handleSubmitPassword={this.handleSubmitPassword}/> : ""}
                <div className="profileContainer">
                <table>
                    <tbody>
                        <tr className="inputBlock">
                            <td className="label">Username</td>
                            <td> {this.state.userData.username}</td>
                            <td className="button">Reset Password</td>
                        </tr>
                        {!this.state.emailToggle ? 
                        <tr className="inputBlock">
                            <td className="label">Email</td>
                            <td> {this.state.email}</td>
                            <td className="button" id="emailToggle" onClick={this.handleEditClick}>Change Email</td>
                        </tr> :
                        <tr className="inputBlock">
                            <td className="label">Email</td>
                            <td><input type= "text" id="email" value= {this.state.email} onChange={this.handleOnChange}/></td>
                            <td className="button" onClick={this.handleSaveClick}>Save</td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            </div>
            
        )
    }
}

export default Profile
