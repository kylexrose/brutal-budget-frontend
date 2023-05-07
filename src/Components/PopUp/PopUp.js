import React, { useState, useEffect } from 'react'
import Axios from '../utils/Axios'
import './PopUp.css'

function PopUp(props) {
        const {modal_id,
            modalDate, 
            setModalDate, 
            modalCategory, 
            setModalCategory, 
            modalDescription, 
            setModalDescription, 
            modalAmount, 
            setModalAmount} = props;
        const [categories, setCategories] = useState([])
        const [newCategoryToggle, setNewCategoryToggle] = useState(false)
        const [newCategory, setNewCategory] = useState("")

        useEffect(() => {
            getAllCategories();
        }, [])

        function handleOnChange(event){
            if(event.target.id === "date"){
                setModalDate(event.target.value)
            }else if(event.target.id === "newCategory"){
                setNewCategory(event.target.value)
            }else if(event.target.id === "description"){
                setModalDescription(event.target.value)
            }else if(event.target.id === "amount"){
                setModalAmount(event.target.value)
            }
        }

        function handleDropDownOnChange(event) {
            if(event.target.value === "addNew"){
                setNewCategoryToggle(true);
            }else{
                setModalCategory(event.target.value);
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

        function renderCategory(){
            if(modalCategory !== "Income"){
                return(
                !newCategoryToggle ? (
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
                )
            )
            }
            
        }

        function renderDropDown() {
            return(
                <select 
                    type= "text"
                    id= "category"
                    name= "category" 
                    value= {modalCategory}
                    onChange={handleDropDownOnChange}>
                    <option value="" >Choose Category...</option>
                    {categories.map(category =>{
                        return(
                            <option key={category._id} 
                            value={category.name} >
                                {category.name}
                            </option>
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
                document.querySelector("#category").value = savedCategory.data.name;
            }catch(e){
                console.log(e)
            }
        }

        function handleCancelCategory() {
            setNewCategoryToggle(false)
        }

        async function saveTransaction(event){
            event.preventDefault();
            const convDate = modalDate.split("-");
            const dateObj = {
                year: +convDate[0],
                month: +convDate[1],
                day: +convDate[2],
            }
            try{
                const updatedInfo = {
                date: dateObj,
                category: modalCategory,
                description : modalDescription,
                amount : modalAmount,
                }
            await Axios.put(`api/transactions/edit-transaction/${modal_id}`, updatedInfo)
            props.closePopUp(event);
            props.handleGetTransactionsByMonth();
            }catch(e){
                console.log(e)
            }
        }

        
        return (
            <div className="popup">
                <div className="input">
                    <form>
                    <h3>{modalCategory === "Income" ? "Edit Income" : "Edit Transaction"}</h3>
                        <div className="inputBlock">
                            <label htmlFor="date">Date</label>
                            <input 
                                type= "date"
                                id= "date"
                                name= "date" 
                                value ={modalDate}
                                onChange={handleOnChange}
                            />
                        </div>
                        {renderCategory()}
                        <div className="inputBlock">
                            <label htmlFor="description">Description&nbsp;</label>
                            <input 
                                type= "text"
                                id= "description"
                                name= "description" 
                                value={modalDescription}
                                onChange={handleOnChange}/>
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="amount">Amount</label>
                            <input 
                                type= "text"
                                id= "amount"
                                name= "amount" 
                                value={modalAmount}
                                onChange={handleOnChange}/>
                        </div>
                        <button className="submit" onClick={saveTransaction}>Save Changes</button>
                        <button className="submit" onClick={props.closePopUp}>Cancel</button>
                    </form>
                </div>
            </div>
        )
    }

export default PopUp