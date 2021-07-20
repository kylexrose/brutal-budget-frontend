import React, { Component } from 'react'
import './Overview.css';

export class Overview extends Component {
    state = {
        months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        currentMonthIndex: 6,
        currentYear: 2021,
    }
    
    handleOnNextMonthClick = () =>{
        this.setState({
            currentYear: this.currentMonthIndex === 11 ? this.currentYear + 1 : this.currentYear,
            currentMonthIndex: this.state.currentMonthIndex === 11 ? 0 : this.state.currentMonthIndex + 1,
        })
    }

    handleOnPrevMonthClick = () =>{
        this.setState({
            currentYear: this.currentMonthIndex === 0 ? this.currentYear - 1 : this.currentYear,
            currentMonthIndex: this.state.currentMonthIndex === 0 ? 11 : this.state.currentMonthIndex - 1,
        })
    }
    render() {
        return (
            <div class="main">
                <div class="selector">
                    <div class="selectorLeft" onClick={this.handleOnPrevMonthClick}>&#9664;</div>
                    <div class="selectorCenter">{this.state.months[this.state.currentMonthIndex]}</div>
                    <div class="selectorRight" onClick={this.handleOnNextMonthClick}>&#9658;</div>
                </div>
                <div class= "overview">

                </div>
                <div class="selector">
                    <div class="selection">All Transactions</div>
                    <div class="selection">Income</div>
                    <div class="selection">Expenses</div>
                </div>
                <div class="transactions">
                    <table>
                        <th>
                            <td>Date</td>
                            <td>Type</td>
                            <td>Category</td>
                            <td>Amount</td>
                        </th>
                    </table>
                </div>
            </div>
        )
    }
}

export default Overview
