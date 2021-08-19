import React, {useState} from 'react'

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

function categorySelection() {
    const [newCategoryToggle, setNewCategoryToggle] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    function handleOnChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    function handleDropDownOnChange(event) {
        if(event.target.value === "addNew"){
            setNewCategoryToggle(true)
        }else{
            handleOnChange(event);
        }
    }

    handleSaveCategory = async (event) =>{
        event.preventDefault();
        try{
            const newCategory = await Axios.post('/api/categories/create-new-category', {name: this.state.newCategory});
            await getAllCategories();
            setNewCategoryToggle(false);
            
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
        setNewCategoryToggle(false)
    }

    renderDropDown = () =>{
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

    return (
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
            onChange= {handleOnChange}/>
            <button id="save" onClick={handleSaveCategory}>Save</button>
            <button id="cancel" onClick={handleCancelCategory}>Cancel</button>
            </div>
            )
    )
}

export default categorySelection