import React, { Component } from 'react'
import './Expense.css'
import Axios from '../utils/Axios'
import {toast} from 'react-toastify'

export class Expense extends Component {
    state = {
        date: "",
        category: "",
        description: "",
        amount: "",
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

    // validateFields = () =>{
    //     if(this.state)
    // }

    handleOnSubmit = async (event) =>{
        event.preventDefault();
        
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
                category: this.state.category,
                type: "Expense"
            }
            await Axios.post('api/transactions/create-new-transaction', newTransaction)
            this.setState({
                date: JSON.stringify(new Date(Date.now())).slice(1, 11),
                description: "",
                amount: "",
                category: "",
            })
            toast.success(`Expense Added`)
        }catch(e){
            console.log(e)
        }
    }
    
    render() {
        return (
            <div className="main">
        <div className= "moneySign">
            <h3>Add Expenses</h3>
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
                <label htmlFor="category">Category</label>
                <input 
                type= "text"
                id= "category"
                name= "category" 
                value={this.state.category}
                onChange={this.handleOnChange}/>
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
                <button className="submit">Enter Expense</button>
            </form>
        </div>
    </div>
        )
    }
}

export default Expense
