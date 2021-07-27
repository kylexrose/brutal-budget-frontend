import React, { Component } from 'react'

export class Confirmation extends Component {
    state= {
        password : "",
    }
    handlePasswordChange = (event) =>{
        this.setState({
            password: event.target.value,
        })
    }
    render() {
        return (
            <div className="confirmContainer">
            <div>Please enter your password to confirm.</div>
            <div className="inputBlock">
                <input type="password" id="passwordCheck" value={this.state.password} onChange={this.handlePasswordChange}/>
                <button onClick={()=>this.props.handleSubmitPassword(this.state.password)}>Confirm</button>
            </div>
        </div>
        )
    }
}

export default Confirmation

