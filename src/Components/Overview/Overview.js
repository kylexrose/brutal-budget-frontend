import React, { useState, useEffect } from 'react'
import './Overview.css';
import Axios from '../utils/Axios';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto'
import randomColor from 'randomcolor';
import Transaction from '../transaction/Transaction';
import PopUp from '../PopUp/PopUp'

function Overview () {
    const date = JSON.stringify(new Date(Date.now())).slice(1, 11);
    const convDate = date.split("-");
    const dateObj = {
            year: +convDate[0],
            month: +convDate[1],
            day: +convDate[2],
        }

    const [months, ] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
    const [currentMonthIndex, setCurrentMonthIndex] = useState(dateObj.month - 1);
    const [currentYear, setCurrentYear] = useState(dateObj.year);
    const [transactionList, setTransactionList] = useState([]);
    const [sortedTransactionList, setSortedTransactionList] = useState([])
    const [overviewObj, setOverviewObj] = useState({});
    const [sorting, setSorting] = useState("allTransactions");
    const [isLoaded, setIsLoaded] = useState(false)

    const [modal_id, setModal_id] = useState("")
    const [modalDate, setModalDate] = useState("");
    const [modalCategory, setModalCategory] = useState("")
    const [modalDescription, setModalDescription] = useState("")
    const [modalAmount, setModalAmount] = useState("")

    const [togglePopUp, setTogglePopUp] = useState(false)

    function closePopUp(event){
        event.preventDefault();
        setTogglePopUp(false)
    }

    function openPopUp(event){
        if(event){
            event.preventDefault();
        }
        setTogglePopUp(true);
    }

    useEffect(() => {
        async function updateMonth (){
            try{
                await handleGetTransactionsByMonth();
            }catch(e){
                console.log(e)
        }}
        updateMonth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMonthIndex,])

    useEffect(() => {
        if(Object.keys(overviewObj).length !== 0){
            setIsLoaded(true);
        }else{
            setIsLoaded(false);
        }
        
    }, [overviewObj])

    useEffect(() => {
        document.querySelector(`#${sorting}`).classList.add("sorting");
        handleGetTransactionsByMonth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting])

    useEffect(() => {
      if (transactionList.length){
        if(sorting === "allTransactions"){
            setSortedTransactionList([...transactionList])
        }else{
            const sortedList = transactionList.map(transaction => transaction.type === sorting)
            setSortedTransactionList(sortedList)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionList])
    
    
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
                `/api/transactions/get-transactions-by-month/${currentYear}/${currentMonthIndex + 1}`)
            setTransactionList( monthlyTransactions.data.payload.transactions )
            setOverviewObj(monthlyTransactions.data.sumObj)
            
        }catch(e){
            console.log(e)
        }
    }

    function renderTransactionList() {
        return(
            sortedTransactionList.map(item => {
                return(
                    <Transaction 
                    key= {item._id} 
                    handleGetTransactionsByMonth={handleGetTransactionsByMonth}
                    setModalDate = {setModalDate}
                    setModalCategory = {setModalCategory}
                    setModalDescription = {setModalDescription}
                    setModalAmount = {setModalAmount}
                    setModal_id = {setModal_id}
                    openPopUp = {openPopUp}
                    item = {item}/>
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
        if(event.target.id !== sorting){
            document.querySelector(`#${sorting}`).classList.remove("sorting");
        setSorting(event.target.id);
        }
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
            {togglePopUp 
            ? <PopUp
                modal_id = {modal_id}
                modalDate = {modalDate}
                setModalDate = {setModalDate}
                modalCategory = {modalCategory}
                setModalCategory = {setModalCategory}
                modalDescription = {modalDescription}
                setModalDescription = {setModalDescription}
                modalAmount = {modalAmount}
                setModalAmount = {setModalAmount}
                closePopUp = {closePopUp}
                handleGetTransactionsByMonth = {handleGetTransactionsByMonth}
            /> 
            : ""}

        </div>
    )
    }

export default Overview
