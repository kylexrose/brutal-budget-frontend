import React, {useState} from 'react'

function categorySelection() {
    const [newCategoryToggle, setNewCategoryToggle] = useState(false)

    function handleOnChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    function handleDropDownOnChange(event) {
        if(event.target.value === "addNew"){
            this.setState({
                newCategoryToggle : true,
            })
        }else{
            this.handleOnChange(event);
        }
    }
    return (
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

export default categorySelection