import React, { Component } from 'react'
import './Overview.css';
import Axios from '../utils/Axios';
import {PieChart} from 'react-minimal-pie-chart';

export class Overview extends Component {
    state = {
        months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        currentMonthIndex: 6,
        currentYear: 2021,
        transactionList:[],
        overviewObj: {},
        isLoaded: false,
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
            const monthlyTransactions = await Axios.get(`/api/transactions/get-transactions-by-month/${this.state.currentYear}/${this.state.currentMonthIndex + 1}`)
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
        
        return(
            <div className= "overview">
                <div className="chart">
                            <PieChart
                                animate= "true"
                                data={[
                                    { title: 'Expenses', value: this.state.overviewObj.Expense, color: 'rgb(189, 16, 51)' },
                                    { title: 'Savings', value: this.state.overviewObj.Savings, color: 'rgb(22, 165, 22)' },
                                    { title: 'Expendable', value: this.state.overviewObj.Income - (this.state.overviewObj.Expense + this.state.overviewObj.Savings), color: 'rgb(152, 152, 152)' },
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

    render() {
        return (
            <div className="main">
                <div className="selector">
                    <div className="arrow selectorLeft" onClick={this.handleOnPrevMonthClick}>&#9664;</div>
                    <div className="selectorCenter">{this.state.months[this.state.currentMonthIndex]}</div>
                    <div className="arrow selectorRight" onClick={this.handleOnNextMonthClick}>&#9658;</div>
                </div>
                {this.state.isLoaded ? this.renderOverview(): ""}
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
