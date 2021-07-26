import React, { Component } from 'react'
import './Expense.css'
import Axios from '../utils/Axios'
import {toast} from 'react-toastify'
import { Link } from 'react-router-dom';


export class Expense extends Component {
    state = {
        date: "",
        categories: [],
        category: "",
        description: "",
        amount: "",
        newCategoryToggle: false,
        newCategory: "",
        
    }

    componentDidMount() {
        this.setState({
            date: JSON.stringify(new Date(Date.now())).slice(1, 11)
        }) 
        this.getAllCategories();
    }
    
    handleOnChange = (event) =>{
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleDropDownOnChange = (event) =>{
        if(event.target.value === "addNew"){
            this.setState({
                newCategoryToggle : true,
            })
        }else{
            this.handleOnChange(event);
        }
    }

    getAllCategories = async () =>{
        try{
            const foundCategories = await Axios.get('api/categories/get-all-categories')
            this.setState({
                categories : foundCategories.data.categories,
            })
        }catch(e){
            console.log(e)
        }
    }

    renderDropDown = () =>{
        return(
            <select 
                type= "text"
                id= "category"
                name= "category" 
                onChange={this.handleDropDownOnChange}>
                <option value="" >Choose Category...</option>
                {this.state.categories.map(category =>{
                    return(
                        <option key={category._id} value={category.name}>{category.name}</option>
                        )
                })}
                <option value="addNew">Add New Category</option>
            </select>
        )
    }

    handleSaveCategory = async (event) =>{
        event.preventDefault();
        try{
            const newCategory = await Axios.post('/api/categories/create-new-category', {name: this.state.newCategory});
            await this.getAllCategories();
            this.setState({
                newCategoryToggle: false,
                category: newCategory.data.name,
            })
            document.querySelector("#category").value = newCategory.data.name;
        }catch(e){
            console.log(e)
        }
    }

    handleCancelCategory = ()=>{
        this.setState({
            newCategoryToggle: false,
        })
    }

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
                    value={`${this.state.date}`}
                    onChange={this.handleOnChange}
                    />
                </div>
                {!this.state.newCategoryToggle ? (
                    <div className="inputBlock">
                    <label htmlFor="category">Category</label>
                    {this.renderDropDown()}
                    </div>
                    ) : (
                    <div className="inputBlock">
                    <label htmlFor="category">Category</label>
                    <input 
                    type= "text"
                    id= "newCategory"
                    name="category"
                    onChange= {this.handleOnChange}/>
                    <button id="save" onClick={this.handleSaveCategory}>Save</button>
                    <button id="cancel" onClick={this.handleCancelCategory}>Cancel</button>
                    </div>
                    )}
                <div className="inputBlock">
                    <label htmlFor="description">Description&nbsp;</label>
                    <input 
                    type= "text"
                    id= "description"
                    name= "description" 
                    value={this.state.description}
                    onChange={this.handleOnChange}/>
                </div>
                <div className="inputBlock">
                    <label htmlFor="amount">Amount</label>
                    <input 
                    type= "text"
                    id= "amount"
                    name= "amount" 
                    value={this.state.amount}
                    onChange={this.handleOnChange}/>
                </div>
                
                <button className="submit" onClick={this.handleOnSubmit}>Enter Expense</button>
            </form>
        </div>
    </div>
        )
    }
}

export default Expense
