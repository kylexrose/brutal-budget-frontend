import React, { Component } from 'react'
import {isStrongPassword} from 'validator'
import QueryString from 'query-string';
import jwt from "jsonwebtoken";
import Axios from '../utils/Axios';

export class PasswordReset extends Component {
    state={
        password:"",
        confirmPassword: "",
        passwordError:"",
        matchError:"",
        id: ""
    }

    componentDidMount(){
        const tokenObj = QueryString.parse(window.location.search);
        try{
            let decodedJwt = jwt.verify(tokenObj.token, process.env.REACT_APP_PRIVATE_JWT_KEY_RESET);
            this.setState({
                id : decodedJwt._id
            })
        }catch(e){
            this.props.history.push("/expired");
        }
    }

    handleOnChange = (event) =>{
        this.setState({
            [event.target.id] : event.target.value,
            passwordError: "",
            matchError: "",
        })
    }

    handleOnBlur = (event)=>{
        if(event.target.id === "password"){
            if(!isStrongPassword(this.state.password)){
                this.setState({
                    passwordError: "Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character, and must be 8 at least characters long" 
                })
            }
        }
        if(this.state.password && this.state.confirmPassword){
            if(this.state.password !== this.state.confirmPassword){
                this.setState({
                    matchError : "Passwords do not match"
                })
            }
        }
    }

    handleOnSubmit = async (event) =>{
        event.preventDefault();
        if(this.state.password === this.state.confirmPassword && isStrongPassword(this.state.password)){
            try{
            await Axios.put('/api/reset/password-change', {_id: this.state.id, password: this.state.password});
            this.props.history.push("/overview")
            }catch(e){
            console.log(e)
            }
        }
        
    }

    render() {
        

        return (
            <div className="body">
                <div className="profileContainer">
                    <form onSubmit={this.handleOnSubmit}>
                        <label htmlFor="password">New password</label><span id="error">{this.state.passwordError}</span>
                        <input type="password" id="password" onChange={this.handleOnChange} onBlur={this.handleOnBlur}/>
                        <label htmlFor="confirmPassword">Confirm password</label><span id="error">{this.state.matchError}</span>
                        <input type="password" id="confirmPassword" onChange={this.handleOnChange} onBlur={this.handleOnBlur}/>
                        <button type="submit" id="submit">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default PasswordReset
