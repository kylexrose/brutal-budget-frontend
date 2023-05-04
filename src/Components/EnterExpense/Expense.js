import React, { useState, useEffect } from 'react'
import './Expense.css'
import Axios from '../utils/Axios'
import {toast} from 'react-toastify'
import { Link } from 'react-router-dom';

function Expense() {

        const [date, setDate] = useState("")
        const [categories, setCategories] = useState([])
        const [category, setCategory] = useState("")
        const [description, setDescription] = useState("")
        const [amount, setAmount] = useState("")
        const [newCategoryToggle, setNewCategoryToggle] = useState(false)
        const [newCategory, setNewCategory] = useState("")

        useEffect(() => {
            setDate(JSON.stringify(new Date(Date.now())).slice(1, 11))
            getAllCategories();
        }, [])
        
        function handleOnChange(event) {
            if(event.target.id === "date"){
                setDate(event.target.value)
            }
            else if(event.target.id === "category"){
                setCategory(event.target.value)
            }
            else if(event.target.id === "newCategory"){
                setNewCategory(event.target.value);
            }
            else if(event.target.id === "amount"){
                setAmount(event.target.value)
            }
            else if(event.target.id === "description"){
                setDescription(event.target.value)
            }
        }

        function handleDropDownOnChange(event) {
            if(event.target.value === "addNew"){
                setNewCategoryToggle(true);
            }else{
                handleOnChange(event);
            }
        }

        async function getAllCategories() {
            try{
                const foundCategories = await Axios.get('api/categories/get-all-categories');
                setCategories(foundCategories.data.categories);
            }catch(e){
                console.log(e)
            }
        }

        function renderDropDown() {
            return(
                <select 
                    type= "text"
                    id= "category"
                    name= "category" 
                    onChange={handleDropDownOnChange}>
                    <option value="" >Choose Category...</option>
                    {categories.map(category =>{
                        return(
                            <option key={category._id} value={category.name}>{category.name}</option>
                            )
                    })}
                    <option value="addNew">Add New Category</option>
                </select>
            )
        }

        async function handleSaveCategory(event) {
            event.preventDefault();
            try{
                const savedCategory = await Axios.post('/api/categories/create-new-category', {name: newCategory});
                setNewCategory('');
                await getAllCategories();
                setNewCategoryToggle(false);
                setCategory(savedCategory.data.name);
                document.querySelector("#category").value = savedCategory.data.name;
            }catch(e){
                console.log(e)
            }
        }

        function handleCancelCategory() {
            setNewCategory('');
            setNewCategoryToggle(false)
        }

        async function handleOnSubmit(event) {
            event.preventDefault();
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
                    category: category,
                    type: "Expense"
                }
                await Axios.post('api/transactions/create-new-transaction', newTransaction)
                setDate(JSON.stringify(new Date(Date.now())).slice(1, 11));
                setDescription("");
                setAmount("");
                setCategory("");
                toast.success(`Expense Added`)
            }catch(e){
                console.log(e)
            }
        }
        return (
            <div className="main">
                <Link className="addButton back" to="/overview">Back</Link>
                <div className= "moneySign">
                    <h3>Add Expenses</h3>
                </div>
                <div className="input">
                    <form>
                        <div className="inputBlock">
                            <label htmlFor="date">Date</label>
                            <input 
                                type= "date"
                                id= "date"
                                name= "date" 
                                value={`${date}`}
                                onChange={handleOnChange}
                            />
                        </div>
                        {!newCategoryToggle ? (
                            <div className="inputBlock">
                                <label htmlFor="category">Category</label>
                                {renderDropDown()}
                            </div>
                        ) : (
                            <div className="inputBlock">
                                <label htmlFor="category">Category</label>
                                <input 
                                type= "text"
                                id= "newCategory"
                                name="category"
                                value={newCategory}
                                onChange= {handleOnChange}/>
                                <button id="save" onClick={handleSaveCategory}>Save</button>
                                <button id="cancel" onClick={handleCancelCategory}>Cancel</button>
                            </div>
                        )}
                        <div className="inputBlock">
                            <label htmlFor="description">Description&nbsp;</label>
                            <input 
                                type= "text"
                                id= "description"
                                name= "description" 
                                value={description}
                                onChange={handleOnChange}/>
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="amount">Amount</label>
                            <input 
                                type= "text"
                                id= "amount"
                                name= "amount" 
                                value={amount}
                                onChange={handleOnChange}/>
                        </div>
                        <button className="submit" onClick={handleOnSubmit}>Enter Expense</button>
                    </form>
                </div>
            </div>
        )
    }

export default Expense