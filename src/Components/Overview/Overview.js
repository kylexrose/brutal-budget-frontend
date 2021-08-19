import React, { useState, useEffect } from 'react'
import './Overview.css';
import Axios from '../utils/Axios';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto'
import randomColor from 'randomcolor'

function Overview () {
    
    const [months, ] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
    const [currentMonthIndex, setCurrentMonthIndex] = useState(6);
    const [currentYear, setCurrentYear] = useState(2021);
    const [transactionList, setTransactionList] = useState([]);
    const [overviewObj, setOverviewObj] = useState({});
    const [sorting, setSorting] = useState("allTransactions");
    const [sorted, setSorted] = useState(["Income", "Expense"]);
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        handleGetTransactionsByMonth();
    }, [])

    useEffect(() => {
        async function updateMonth (){
            try{
                await handleGetTransactionsByMonth();
            }catch(e){
                console.log(e)
        }}
        updateMonth();
    }, [currentMonthIndex])

    useEffect(() => {
        if(Object.keys(overviewObj).length !== 0){
            setIsLoaded(true);
        }else{
            setIsLoaded(false)
        }
        
    }, [overviewObj])

    useEffect(() => {
        document.querySelector(`#${sorting}`).classList.add("sorting");
        handleGetTransactionsByMonth();
    }, [sorted])
    
    function handleOnNextMonthClick() {
        setCurrentYear(currentMonthIndex === 11 ? currentYear + 1 : currentYear)
        setCurrentMonthIndex(currentMonthIndex === 11 ? 0 : currentMonthIndex + 1)
    }

    function handleOnPrevMonthClick() {
        setCurrentYear(currentMonthIndex === 0 ? currentYear - 1 : currentYear);
        setCurrentMonthIndex(currentMonthIndex === 0 ? 11 : currentMonthIndex - 1);
    }

    async function handleGetTransactionsByMonth() {
        try{
            const monthlyTransactions = await Axios.post(
                `/api/transactions/get-transactions-by-month/${currentYear}/${currentMonthIndex + 1}`, 
                {sorted: sorted})
            setTransactionList( monthlyTransactions.data.payload.transactions )
            setOverviewObj(monthlyTransactions.data.sumObj)
        }catch(e){
            console.log(e)
        }
    }

    function renderTransactionList() {
        return(
        transactionList.map(item => {
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

    function setUpChart(){
        let labels = []; 
        let amounts =[];
        let colors = [];
        if(sorting === "allTransactions" || sorting === "Income"){
            document.querySelector("#chartContainer").innerHTML= '<canvas id="chart"></canvas>';
            labels = [
                'Expenses',
                'Savings',
                'Expendable'
                ];
            amounts = [
                overviewObj.Expense, 
                overviewObj.Savings, 
                overviewObj.Income - (overviewObj.Expense + overviewObj.Savings)
                ];
            colors = [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ]
        }else{
            document.querySelector("#chartContainer").innerHTML= '<canvas id="chart"></canvas>';
            for (let key in overviewObj.category){
                labels.push(key);
                amounts.push(overviewObj.category[key]);
                colors.push(randomColor())
            }
        }
        
        var ctx = document.getElementById('chart');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                label: 'Overview',
                data: amounts,
                backgroundColor: colors,
                hoverOffset: 4
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function renderOverview() {
        if(transactionList.length === 0){
            return (
                <div className= "overview">
                    <h3>No transaction data found.</h3>
                </div>
            )
        }

        return(
            <div className= "overview">
                <div className="chart" id="chartContainer">
                    <canvas id="chart">
                    </canvas>
                </div>
                <div className="overviewTable">
                    <div>
                        <h2>
                            Income:  {overviewObj.Income}<br/>
                            Savings:  <span className="saving">{overviewObj.Savings}</span><br/>
                            Expenses:  <span className="neg">{overviewObj.Expense}</span><br/>
                            Remaining: <span className="remaining">{overviewObj.Income - (overviewObj.Expense + overviewObj.Savings)}</span>
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

    function handleSortClick(event) {
        document.querySelector(`#${sorting}`).classList.remove("sorting");
        setSorting(event.target.id);
        setSorted(event.target.id === "allTransactions" ? ["Income", "Expense"] : [event.target.id])
    }
    return (
        <div className="main">
            <div className="selector">
                <div className="arrow selectorLeft" onClick={handleOnPrevMonthClick}>&#9664;</div>
                <div className="selectorCenter">{months[currentMonthIndex]}</div>
                <div className="arrow selectorRight" onClick={handleOnNextMonthClick}>&#9658;</div>
            </div>

            {isLoaded ? renderOverview(): ""}
            {document.querySelector('#chartContainer') ? setUpChart() : ""}
            <div className="filterContainer">
                <Link className="addButton" to='/add-expense'>+ Expense</Link>
                <div className="selector">
                    <div className="selection" id="allTransactions" onClick={handleSortClick}>All Transactions</div>
                    <div className="selection" id="Income" onClick={handleSortClick}>Income</div>
                    <div className="selection" id="Expense" onClick={handleSortClick}>Expenses</div>
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
                        {renderTransactionList()}
                    </tbody>
                </table>
            </div>
        </div>
    )
    }

export default Overview
