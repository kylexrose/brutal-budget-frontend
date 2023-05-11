import React, { useState, useEffect } from 'react'
import Axios from '../utils/Axios'
import './PopUp.css'
import {
    Container, 
    CssBaseline, 
    Box, 
    Typography, 
    TextField, 
    Button,
    ToggleButton,
    ToggleButtonGroup,
    FormControl, 
    Select, 
    MenuItem,
    InputLabel} from '@mui/material';

function PopUp(props) {
        const [categories, setCategories] = useState([]);
        const [newCategoryToggle, setNewCategoryToggle] = useState(false);
        const [newCategory, setNewCategory] = useState("");
        const [date, setDate] = useState("");
        const [category, setCategory] = useState("");
        const [description, setDescription] = useState("");
        const [amount, setAmount] = useState("");
        const [error, setError] = useState(true);
        const [transactionType, setTransactionType] = useState('Expense');

        useEffect(() => {
            getAllCategories();
        }, [])

        useEffect(() => {
          setError(!date || (!category && transactionType !== "Income") || amount <=0);
        }, [date, category, amount, transactionType])
        

        function handleOnChange(event){
            if(event.target.id === "date"){
                setDate(event.target.value)
            }else if(event.target.id === "newCategory"){
                setNewCategory(event.target.value)
            }else if(event.target.id === "description"){
                setDescription(event.target.value)
            }else if(event.target.id === "amount"){
                setAmount(event.target.value)
            }else if(event.target.id === "transactionType"){
                setTransactionType(event.target.value);
            }
        }

        function handleDropDownOnChange(event) {
            if(event.target.value === "addNew"){
                setNewCategoryToggle(true);
                document.querySelector('#categoryText').focus();
            }else{
                setCategory(event.target.value);
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

        function renderCategoryInput(){
            if(transactionType === "Expense" && newCategoryToggle){
                return(
                    <TextField
                        required
                        margin="normal"
                        fullWidth
                        autoFocus
                        name="newCategory"
                        label="Category"
                        value={newCategory}
                        type="text"
                        id="newCategory"
                        variant="standard"
                        onChange={handleOnChange}
                    />
            )
                }else if(transactionType === "Expense" &&!newCategoryToggle){
                    return(
                        <FormControl fullWidth required>
                            <InputLabel>Category</InputLabel>
                            <Select
                                required
                                id="categoryText" 
                                variant="standard"
                                value={category}
                                onChange={handleDropDownOnChange}
                                >
                                {categories.map((category)=>{
                                    return(<MenuItem value={category.name} key={category._id}>{category.name}</MenuItem>)
                                })}
                                <MenuItem value="addNew">Add New Category</MenuItem>
                            </Select>
                        </FormControl>
                    )   
        }else{
            return
        }}

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
            const convDate = date.split("-");
            const dateObj = {
                year: +convDate[0],
                month: +convDate[1],
                day: +convDate[2],
            }
            try{
                const newTransactionInfo = {
                date: dateObj,
                category,
                description,
                amount,
                type: transactionType
                }
            const newTransaction = await Axios.post(`api/transactions/create-new-transaction`, newTransactionInfo);
            console.log(newTransaction.data)
            props.closePopUp(event);
            props.handleGetTransactionsByMonth();
            }catch(e){
                console.log(e)
            }
        }
        
        return (
            <Container className= "popup" component="main" maxWidth="xs" >
                <CssBaseline />
                    <Box
                        sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 5,
                        borderRadius: 5,
                        background: '#77b28c',
                        }}
                    >
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color="inherit"
                            variant="h5"
                            component="div">
                                Add Transaction
                                <ToggleButtonGroup
                                    color="primary"
                                    id="transactionType"
                                    value={transactionType}
                                    exclusive
                                    onChange={(e) => {setTransactionType(e.target.value)}}
                                    aria-label="Transaction Type"
                                >
                                    <ToggleButton value="Income">Income</ToggleButton>
                                    <ToggleButton value="Expense">Expense</ToggleButton>
                                </ToggleButtonGroup>
                            
                            </Typography>
                        <TextField
                            margin="normal"
                            fullWidth
                            name="date"
                            helperText="Date*"
                            type="date"
                            id="date"
                            variant="standard"
                            onChange={handleOnChange}
                        />
                        {renderCategoryInput()}
                    <TextField
                        margin="normal"
                        fullWidth
                        name="description"
                        label="Description"
                        type="text"
                        id="description"
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="normal"
                        fullWidth
                        name="amount"
                        label="Amount"
                        type="number"
                        id="amount"
                        variant="standard"
                        onChange={handleOnChange}
                    />
                    <Button
                        disabled={error}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, borderRadius: 10, backgroundColor: '#ddf1cf', color: 'black' }}
                        onClick={saveTransaction}
                    >
                        Create Transaction
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, borderRadius: 10, backgroundColor: '#ddf1cf', color: 'black' }}
                        onClick={props.closePopUp}
                    >
                        Cancel
                    </Button>
                </Box>
            </Container>
        )
    }

export default PopUp