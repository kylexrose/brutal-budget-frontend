import React, { useState, useEffect } from 'react';
import './Overview.css';
import Axios from '../utils/Axios';
import TransactionList from '../transaction/TransactionList';
import PopUp from '../PopUp/PopUp';
import Chart from '../Chart/Chart';
import {
    Box, 
    Snackbar, 
    Alert, 
    Typography, 
    IconButton, 
    Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Overview () {
    const date = JSON.stringify(new Date(Date.now())).slice(1, 11); // Building the dateObj for use in initial state
    const convDate = date.split('-');
    const dateObj = {
            year: +convDate[0],
            month: +convDate[1],
            day: +convDate[2],
        }

    const [months, ] = useState([
        'January', 'February', 'March', 
        'April', 'May', 'June', 'July', 
        'August', 'September', 'October', 
        'November', 'December']);
    const [currentMonthIndex, setCurrentMonthIndex] = useState( dateObj.month - 1 );
    const [currentYear, setCurrentYear] = useState( dateObj.year );
    const [transactionList, setTransactionList] = useState( [] );
    const [overviewObj, setOverviewObj] = useState( {} );
    const [isLoaded, setIsLoaded] = useState( false );
    const [filter, setFilter] = useState( 'allTransactionsSort' );
    const [sortingBy, setSortingBy] = useState( 'All Transactions' );
    const [togglePopUp, setTogglePopUp] = useState( false );
    const [filteredList, setFilteredList] = useState( [] );
    const [categories, setCategories] = useState( [] );
    const [alert, setAlert] = useState( '' );
    const [alertSeverity, setAlertSeverity] = useState( 'warning' );

    function closePopUp( event ){
        event.preventDefault();
        setTogglePopUp( false );
    }

    function openPopUp( event ){
        if( event ){
            event.preventDefault();
        }
        setTogglePopUp( true );
    }

    useEffect( () => {
        async function updateMonth() {
            try{
                await handleGetTransactionsByMonth();
            }catch( e ){
                console.log( e );
        }}
        updateMonth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMonthIndex,] );

    useEffect(() => { // A listener to make sure the overviewObj has returned before rendering it 
        if( Object.keys( overviewObj ).length !== 0 ){
            setIsLoaded( true );
        }else{
            setIsLoaded( false );
        }
        
    }, [overviewObj]);

    useEffect(() => { // Filters the transactionList and saves it to the state
        const list = transactionList.filter( transaction => {
            if( filter === 'allTransactionsSort' ){
                return true;
            }else if( filter === 'incomeSort' ) {
                return !transaction.category;
            }else {
                return transaction.category;
            }
        } );
        setFilteredList(list);
    }, [transactionList, filter] ); 
    
    function handleOnNextMonthClick() {
        setCurrentYear( currentMonthIndex === 11 ? currentYear + 1 : currentYear );
        setCurrentMonthIndex( currentMonthIndex === 11 ? 0 : currentMonthIndex + 1 );
    }

    function handleOnPrevMonthClick() {
        setCurrentYear( currentMonthIndex === 0 ? currentYear - 1 : currentYear );
        setCurrentMonthIndex( currentMonthIndex === 0 ? 11 : currentMonthIndex - 1 );
    }

    async function handleGetTransactionsByMonth() {
        try{
            const monthlyTransactions = await Axios.post(
                `/api/transactions/get-transactions-by-month/${currentYear}/${currentMonthIndex + 1}`);
            setTransactionList( monthlyTransactions.data.payload.transactions );
            setOverviewObj( monthlyTransactions.data.sumObj );
        }catch( e ){
            console.log( e );
        }
    }

    function renderTransactionList() {
        return(
            <Box sx={ { display: "flex", flexDirection: "column", width: "100%" } }>
                <Box sx={ { display: "flex", justifyContent: "space-between", alignItems: "center" } }>
                    <Tooltip title="Prev Month">
                        <IconButton onClick={ handleOnPrevMonthClick }>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography>{ months[currentMonthIndex] }</Typography>
                    <Tooltip title="Next Month">
                        <IconButton onClick={ handleOnNextMonthClick }>
                            <ArrowForwardIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <TransactionList 
                    transactionList = { transactionList } 
                    handleGetTransactionsByMonth = { handleGetTransactionsByMonth }
                    openPopUp = { openPopUp }
                    filter = { filter }
                    setFilter = { setFilter }
                    sortingBy = { sortingBy }
                    setSortingBy = { setSortingBy }
                    filteredList = { filteredList }
                    categories = { categories }
                    setCategories = { setCategories }
                    setAlert = { setAlert }
                    setAlertSeverity = { setAlertSeverity }
                />
            </Box>
        )
    }

    function renderOverview() {

        return(

               <div className="chartContainer" styles={ {
                display: "flex",
                alignContent: "center",
                height: "100lh",
               } }>
                    <Chart 
                    filteredList = { filteredList } 
                    sortingBy= { sortingBy }
                    categories= { categories }/>
              </div>

        )
    }

    return (
        <div className="main">
            <Snackbar
                    open={ !!alert }
                    onClose={ () => {
                        setAlert( '' )
                        setAlertSeverity( 'warning' ) } }
                    autoHideDuration={ 4000 }
                    anchorOrigin={ { vertical: "bottom", horizontal: "center" } }
                >
                    <Alert severity={ alertSeverity }>
                        { alert }
                    </Alert>
                </Snackbar>
            
            { isLoaded ? renderOverview(): '' }
            
            <Box sx= { {
                maxWidth:500,
                display: "inline-flex",
            } }>
                { renderTransactionList() }
            </Box>
            { togglePopUp 
            ? <PopUp
                closePopUp = { closePopUp }
                handleGetTransactionsByMonth = { handleGetTransactionsByMonth }
                setAlert = { setAlert }
                setAlertSeverity = { setAlertSeverity }
            /> 
            : '' }
        </div>
    )
};

export default Overview
