import React, {useState} from 'react'
import Axios from '../utils/Axios'
import './Transaction.css'


function Transaction(props) {
    const {item} = props;
    
    const date = `${item.date.year}-${item.date.month < 10 ? "0"+item.date.month: item.date.month}-${item.date.day < 10 ? "0"+item.date.day: item.date.day}`;
    const category = item.type === "Income" ? item.type : item.category;
    const description = item.description;
    const amount = item.amount;
    const className = item.type === "Expense" ? "neg" : "";

    function generatePopUp(){
        props.setModal_id(item._id)
        props.setModalDate(date);
        props.setModalCategory(category);
        props.setModalDescription(description);
        props.setModalAmount(amount);
        props.openPopUp();
    }

    async function handleDelete(event){
        event.preventDefault();
        try{
            await Axios.delete(`api/transactions/delete-transaction/${item._id}`)
            props.handleGetTransactionsByMonth();
        }catch(e){
            console.log(e)
        }

    }
    return(

        <tr>
            <td>{date}</td>
            <td>{category}</td>
            <td>{description}</td>
            <td className={className}>{amount}</td>
            <td className="saveButton button" onClick={generatePopUp}>Edit</td>
            <td className="deleteButton button" onClick={handleDelete}>Delete</td>
        </tr>
    )
}

export default Transaction;  
