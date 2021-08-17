import React, { Component } from 'react'
import './Overview.css';
import Axios from '../utils/Axios';
import {PieChart} from 'react-minimal-pie-chart';
import { Link } from 'react-router-dom';

export class Overview extends Component {
    state = {
        months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        currentMonthIndex: 6,
        currentYear: 2021,
        transactionList:[],
        overviewObj: {},
        isLoaded: false,
        sorting: "allTransactions",
        sorted: ["Income", "Expense"],
    }

    async componentDidMount() {
            await this.handleGetTransactionsByMonth();
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
            const monthlyTransactions = await Axios.post(
                `/api/transactions/get-transactions-by-month/${this.state.currentYear}/${this.state.currentMonthIndex + 1}`, 
                {sorted: this.state.sorted})
            this.setState({
                transactionList : monthlyTransactions.data.payload.transactions,
                overviewObj: monthlyTransactions.data.sumObj,
            }, ()=>{
                console.log(this.state.overviewObj)
                this.setState({
                    isLoaded: true,
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    renderTransactionList = () =>{
        return(
        this.state.transactionList.map(item => {
            const className = item.type === "Expense" ? "neg" : "";
            return(
                <tr key={item._id}>
                    <td>{`${item.date.year} / ${item.date.month} / ${item.date.day}`}</td>
                    <td>{item.type === "Income" ? item.type : item.category}</td>
                    <td>{item.description}</td>
                    <td className={className}>{item.type !== "Income" ? `-${item.amount}` : item.amount}</td>
                </tr>
            )
        })
        )
    }

    renderOverview = () =>{
        if(this.state.transactionList.length === 0){
            return (
                <div className= "overview">
                    <h3>No transaction data found.</h3>
                </div>
            )
        }
        return(
            <div className= "overview">
                <div className="chart">
                    <PieChart
                        animate= "true"
                        data={[
                            { title: 'Expenses', value: this.state.overviewObj.Expense, color: 'rgb(189, 16, 51)' },
                            { title: 'Savings', value: this.state.overviewObj.Savings, color: 'rgb(105, 105, 245)' },
                            { title: 'Expendable', value: this.state.overviewObj.Income - (this.state.overviewObj.Expense + this.state.overviewObj.Savings), color: 'rgb(75, 196, 75)' },
                        ]}
                    />
                </div>
                <div className="overviewTable">
                    <div>
                        <h2>
                            Income:  {this.state.overviewObj.Income}<br/>
                            Savings:  <span className="saving">{this.state.overviewObj.Savings}</span><br/>
                            Expenses:  <span className="neg">{this.state.overviewObj.Expense}</span>
                        </h2>
                    </div>
                    <div className="keys">
                        <div><span className="neg">Expenses</span></div>
                        <div><span className="saving">Savings</span></div>
                        <div><span className="remaining">Remaining</span></div>
                    </div>
                </div>
            </div>
        )
    }

    handleSortClick = (event)=>{
        document.querySelector(`#${this.state.sorting}`).classList.remove("sorting");
        this.setState({
            sorting: event.target.id,
            sorted: event.target.id === "allTransactions" ? ["Income", "Expense"] : [event.target.id]
        }, () =>{
            console.log(this.state.sorted)
            document.querySelector(`#${this.state.sorting}`).classList.add("sorting");
            this.handleGetTransactionsByMonth();
        })
    }

    render() {
        return (
            <div className="main">
                <div className="selector">
                    <div className="arrow selectorLeft" onClick={this.handleOnPrevMonthClick}>&#9664;</div>
                    <div className="selectorCenter">{this.state.months[this.state.currentMonthIndex]}</div>
                    <div className="arrow selectorRight" onClick={this.handleOnNextMonthClick}>&#9658;</div>
                </div>
                {this.state.isLoaded ? this.renderOverview(): ""}
                <div className="filterContainer">
                    <Link className="addButton" to='/add-expense'>+ Expense</Link>
                    <div className="selector">
                        <div className="selection" id="allTransactions" onClick={this.handleSortClick}>All Transactions</div>
                        <div className="selection" id="Income" onClick={this.handleSortClick}>Income</div>
                        <div className="selection" id="Expense" onClick={this.handleSortClick}>Expenses</div>
                    </div>
                    <Link className="addButton" to = '/add-income'>+ Income</Link>
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
