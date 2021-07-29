import React, { Component } from 'react'
import Axios from '../utils/Axios'

export class CategoryRow extends Component {
    state= {
        canEdit: false,
        name: this.props.category.name,
    }

    handleEditClick = () =>{
        this.setState({
            canEdit: true,
        })
    }

    handleSaveClick = async ()=>{
        try{
            await Axios.put(`/api/categories/edit-category/${this.props.category._id}`, {name: this.state.name});

            this.setState({
                canEdit: false, 
            })
        }catch(e){
            console.log(e)
        }
    }

    handleOnChange=(event) =>{
        this.setState({
            name: event.target.value,
        })
    }
    render() {
        return (
            <tr>
                {!this.state.canEdit ? <td>{this.state.name}</td> : 
                <td><input 
                id={this.props._id}
                value={this.state.name}
                onChange={this.handleOnChange}/></td>}
                {!this.state.canEdit ? 
                <td className="categoryButton editButton" onClick={this.handleEditClick}>Edit</td> :
                <td className="categoryButton saveButton" onClick={this.handleSaveClick}>Save</td>}
                <td className="categoryButton deleteButton" onClick={() =>this.props.handleDeleteClick(this.props.category._id)}>Delete</td>
            </tr>
        )
    }
}

export default CategoryRow
