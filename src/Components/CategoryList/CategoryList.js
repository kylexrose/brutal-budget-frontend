import React, { Component } from 'react'
import Axios from '../utils/Axios'
import CategoryRow from './CategoryRow';

export class CategoryList extends Component {
    state={
        categoryList: [],
    }
    async componentDidMount(){
        try{
            const categoryList = await Axios.get("/api/categories/get-all-categories");
            this.setState({
                categoryList: categoryList.data.categories,
            })
        }catch(e){
            console.log(e)
        }
    }

    handleDeleteClick = async (_id)=>{
        try{
            await Axios.delete(`/api/categories/delete-category/${_id}`)
            let newCategoryList = this.state.categoryList.filter(item => item._id !== _id);
            this.setState({
                categoryList: newCategoryList,
            })
        }catch(e){
            console.log(e)
        }
    }

    render() {
        return (
            <div className="listContainer">
                <h2>User Catagories</h2>
                <table>
                    <tbody>
                        
                        {!this.state.categoryList ? <></> : this.state.categoryList.map((category)=>{
                            return (
                                <CategoryRow key={category._id} 
                                category={category} 
                                handleDeleteClick={this.handleDeleteClick}/> 
                            )
                        })}
                    </tbody>
                </table>
                
            </div>
        )
    }
}

export default CategoryList
