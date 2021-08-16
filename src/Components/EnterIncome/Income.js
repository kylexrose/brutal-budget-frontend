import React, { Component } from 'react';
import './Income.css';
import Axios from '../utils/Axios';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';

export class Income extends Component {
    state = {
        date: "",
        description: "",
        amount: "",
        amountError: "", 
    }

    componentDidMount() {
        this.setState({
            date: JSON.stringify(new Date(Date.now())).slice(1, 11)
        })
    }
    
    handleOnChange = (event) =>{
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleOnSubmit = async (event) =>{
        event.preventDefault();
        if(!this.state.amountError){
            try{
            const convDate = this.state.date.split("-");
            const dateObj = {
                year: +convDate[0],
                month: +convDate[1],
                day: +convDate[2],
            }
            const newTransaction = {
                date: dateObj,
                description: this.state.description,
                amount: this.state.amount,
                type: "Income"
            }
            await Axios.post('api/transactions/create-new-transaction', newTransaction)
            this.setState({
                date: JSON.stringify(new Date(Date.now())).slice(1, 11),
                description: "",
                amount: ""
            })
            toast.success(`Income Added`)
            }catch(e){
                console.log(e)
            }
        }
        
    }
    
    render() {
        return (
            <div className="main">
                <Link className="addButton back" to="/overview">Back</Link>
                <div className= "moneySign">
                    <h3>Income</h3>
                </div>
                <div className="input">
                    <form onSubmit={this.handleOnSubmit}>
                        <label htmlFor="date">Date</label>
                        <input 
                        type= "date"
                        id= "date"
                        name= "date" 
                        value={`${this.state.date}`}
                        onChange={this.handleOnChange}
                        />
                        <label htmlFor="description">Description</label>
                        <input 
                        type= "text"
                        id= "description"
                        name= "description" 
                        value={this.state.description}
                        onChange={this.handleOnChange}/>
                        <label htmlFor="amount">Amount</label>
                        <input 
                        type= "text"
                        id= "amount"
                        name= "amount" 
                        value={this.state.amount}
                        onChange={this.handleOnChange}/>
                        <button className="submit">Enter Income</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Income
