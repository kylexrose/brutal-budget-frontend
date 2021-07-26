import React, { Component } from 'react';
import Axios from "../utils/Axios";
import './Profile.css';

export class Profile extends Component {
    state = {
        userData : {},
        nameToggle: false,
        mobileNumberToggle: false,
        emailToggle: false,
        firstName:"",
        lastName:"",
        email: "",
        mobileNumber: "",
    }

    async componentDidMount(){
        try{
            const userData = await Axios.get(`/api/users/get-user-data`);
            console.log(userData)
            this.setState({
                userData: userData.data.payload,
            }, () =>{
                this.setState({
                    firstName: this.state.userData.firstName,
                    lastName : this.state.userData.lastName,
                    email : this.state.userData.email,
                    mobileNumber: this.state.userData.mobileNumber,
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    handleEditClick = (event) =>{
        console.log(this.state.nameToggle)
        this.setState({
            [`${event.target.id}Toggle`] : true,
        })
    }

    handleOnChange = (event)=>{
        this.setState({
            [event.target.id] : event.target.value,
        })
    }

    render() {
        return (
            <div className="body">
                <div className="profileContainer">
                <table>
                    <tbody>           
                        {this.state.toggleName ? 
                        <tr className="inputBlock">
                            <td className="label">Name</td>
                            <td>{this.state.firstName} {this.state.lastName}</td>
                            <td className="button" id="name" onClick={this.handleEditClick}>Edit</td>
                        </tr>: 
                        <tr className="inputBlock">
                            <td className="label">Name</td>
                            <td><input
                            type="text"
                            id= "firstName"
                            value= {this.state.firstName}
                            onChange={this.handleOnChange}/>
                            <input
                            type="text"
                            id= "lastName"
                            value= {this.state.lastName}
                            onChange={this.handleOnChange}/></td>
                            <td className="button" id="name" onClick={this.handleSaveClick}>Save</td>
                        </tr>}  
                        
                        <tr className="inputBlock">
                            <td className="label">Username</td>
                            <td> {this.state.userData.username}</td>
                        </tr>
                        <tr className="inputBlock">
                            <td className="label">Email</td>
                            <td> {this.state.email}</td>
                            <td className="button">Change Email</td>
                        </tr>
                        <tr className="inputBlock">
                            <td className="label">Mobile Number</td>
                            <td> {this.state.mobileNumber}</td>
                            <td className="button">Change Mobile</td>
                        </tr>
                        <tr className="inputBlock">
                            <td className="button">Reset Password</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
            
        )
    }
}

export default Profile
