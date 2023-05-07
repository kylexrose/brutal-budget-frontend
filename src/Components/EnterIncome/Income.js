import React, { useState, useEffect } from 'react';
import './Income.css';
import Axios from '../utils/Axios';
import { Link } from 'react-router-dom';
import {Snackbar, Alert} from '@mui/material';

function Income() {
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [alert, setAlert] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("warning");

    useEffect(() => {
        setDate(JSON.stringify(new Date(Date.now())).slice(1, 11))
    }, [])
    
    function handleOnChange(event) {
        if(event.target.id === "date"){
            setDate(event.target.value)
        }else if(event.target.id === "amount"){
            setAmount(event.target.value)
        }else if(event.target.id === "description"){
            setDescription(event.target.value)
        }
    }

    async function handleOnSubmit(event) {
        event.preventDefault();
        if(!amount || amount <= 0){
            setAlert('Your income amount must be set.')
            setAlertSeverity('error');
            return;
        }

        try{
        const convDate = date.split("-");
        const dateObj = {
            year: +convDate[0],
            month: +convDate[1],
            day: +convDate[2],
        }
        const newTransaction = {
            date: dateObj,
            description: description,
            amount: amount,
            type: "Income"
        }
        await Axios.post('api/transactions/create-new-transaction', newTransaction)
        setDate(JSON.stringify(new Date(Date.now())).slice(1, 11));
        setDescription("");
        setAmount("");
        setAlert('Income Added');
        setAlertSeverity('success')
        }catch(e){
            console.log(e)
        }
    }
        
    return (
        <div className="main">
            <Link className="addButton back" to="/overview">Back</Link>
            <div className= "moneySign">
                <h3>Income</h3>
            </div>
            <div className="input">
                <form onSubmit={handleOnSubmit}>
                    <label htmlFor="date">Date</label>
                    <input 
                    type= "date"
                    id= "date"
                    name= "date" 
                    value={`${date}`}
                    onChange={handleOnChange}
                    />
                    <label htmlFor="description">Description</label>
                    <input 
                    type= "text"
                    id= "description"
                    name= "description" 
                    value={description}
                    onChange={handleOnChange}/>
                    <label htmlFor="amount">Amount</label>
                    <input 
                    type= "text"
                    id= "amount"
                    name= "amount" 
                    value={amount}
                    onChange={handleOnChange}/>
                    <button className="submit">Enter Income</button>
                </form>
                <Snackbar
                    open={!!alert}
                    onClose={() => {
                        setAlert("")
                        setAlertSeverity("warning")}}
                    autoHideDuration={4000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
                    >
                        <Alert severity={alertSeverity}>
                            {alert}
                        </Alert>
                    </Snackbar>
            </div>
        </div>
    )
}

export default Income


