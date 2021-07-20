import React, { Component } from 'react'
import './Overview.css';
import Axios from '../utils/Axios';

export class Overview extends Component {
    state = {
        months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        currentMonthIndex: 6,
        currentYear: 2021,
        transactionList:[],
    }

    componentDidMount() {
        this.handleGetTransactionsByMonth();
    }

    async componentDidUpdate (prevProps, previousState) {
        try{
            if(previousState.currentMonthIndex !== this.state.currentMonthIndex){
                await this.handleGetTransactionsByMonth();
        }
    }catch(e){
        console.log(e)
    }
    }
    
    handleOnNextMonthClick = () =>{
        this.setState({
            currentYear: this.state.currentMonthIndex === 11 ? this.state.currentYear + 1 : this.state.currentYear,
            currentMonthIndex: this.state.currentMonthIndex === 11 ? 0 : this.state.currentMonthIndex + 1,
        }, () => {
            this.handleGetTransactionsByMonth()
        })
    }

    handleOnPrevMonthClick = () =>{
        this.setState({
            currentYear: this.state.currentMonthIndex === 0 ? this.currentYear - 1 : this.state.currentYear,
            currentMonthIndex: this.state.currentMonthIndex === 0 ? 11 : this.state.currentMonthIndex - 1,
        }, () =>{
            this.handleGetTransactionsByMonth()
        })
    }

    handleGetTransactionsByMonth = async() =>{
        try{
            const monthlyTransactions = await Axios.get(`/api/transactions/get-transactions-by-month/${this.state.currentYear}/${this.state.currentMonthIndex + 1}`)
            this.setState({
                transactionList : monthlyTransactions.data.transactions,
            })
        }catch(e){
            console.log(e)
        }
    }

    renderTransactionList = () =>{
        return(
        this.state.transactionList.map(item => {
            return(
                <tr key={item._id}>
                    <td>{`${item.date.year} / ${item.date.month} / ${item.date.day}`}</td>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                    <td>{item.amount}</td>
                </tr>
            )
        })
        )
    }

    render() {
        return (
            <div className="main">
                <div className="selector">
                    <div className="arrow selectorLeft" onClick={this.handleOnPrevMonthClick}>&#9664;</div>
                    <div className="selectorCenter">{this.state.months[this.state.currentMonthIndex]}</div>
                    <div className="arrow selectorRight" onClick={this.handleOnNextMonthClick}>&#9658;</div>
                </div>
                <div className= "overview">

                </div>
                <div className="selector">
                    <div className="selection">All Transactions</div>
                    <div className="selection">Income</div>
                    <div className="selection">Expenses</div>
                </div>
                <div className="transactions">
                    <table>
                        <thead>
                            <tr>
                                <td>Date</td>
                                <td>Category</td>
                                <td>Description</td>
                                <td>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTransactionList()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Overview
