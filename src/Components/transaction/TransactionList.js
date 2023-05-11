
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    TextField,
    Radio,
    Select,
    MenuItem,
    IconButton,
    Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import SortingMenu from '../SortingMenu/SortingMenu';
import Axios from '../utils/Axios';
import { FormControl } from '@mui/base';


function TransactionList({
    transactionList, 
    handleGetTransactionsByMonth, 
    openPopUp,
    categories,
    setCategories,
    setFilter,
    sortingBy,
    setSortingBy,
    filteredList}) {

    const [rows, setRows] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState("");
    const [editingSelected, setEditingSelected] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");
    const [selectedAmount, setSelectedAmount] = useState("");
    const [newCategoryToggle, setNewCategoryToggle] = useState(false)
    const [newCategory, setNewCategory] = useState("")
    const [renderedList, setRenderedList] = useState("");

    useEffect(() => { //Builds the table rows from the filtered list
        const build = []
        filteredList.forEach(transaction => {
            let {date, category, description, amount, _id, type} = transaction;
            build.push(createData(date, category, description, amount, _id, type))
        });
        setRows(build);
    }, [filteredList, transactionList])

    useEffect(() => { //Builds the category list within the table's edit function
        setRenderedList(
            !newCategoryToggle ?
            <FormControl><Select 
                id="categoryDropdown" 
                label="Category" 
                variant="standard" 
                value={selectedCategory}
                onChange={handleOnDropdownChange}
                >
                    {categories.map((category)=>{
                        return(<MenuItem value={category.name} key={category._id}>{category.name}</MenuItem>)
                    })}
                    <MenuItem value="addNew">Add New Category</MenuItem>
    
            </Select></FormControl>
            :
                <TextField id={"categoryText"} label="Category" variant="standard" value={newCategory} onChange={handleOnChange}></TextField>
        )
    }, [categories, selectedCategory, newCategoryToggle, newCategory])

function createData(date, category, description, amount, key, type) {
    return {
    date: `${date.year}-${date.month < 10 ? "0"+ date.month: date.month}-${ date.day < 10 ? "0"+ date.day: date.day}`,
    category,
    description,
    amount,
    key,
    type
    }
};

async function getAllCategories() {
    try{
        const foundCategories = await Axios.get('api/categories/get-all-categories');
        console.log(foundCategories)
        setCategories(foundCategories.data.categories);
    }catch(e){
        console.log(e)
    }
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// TODO
// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Amount',
  }
];

function handleOnChange(event){
    switch(event.target.id){
        case('dateText'):
            setSelectedDate(event.target.value);
            break;
        case('descriptionText'):
            setSelectedDescription(event.target.value);
            break;
        case('categoryText'):
            setNewCategory(event.target.value);
            break;
        case('amountText'):
            setSelectedAmount(event.target.value);
            break;
        default: break
    }
}

function handleOnDropdownChange(e){
    if(e.target.value === "addNew"){
        setNewCategoryToggle(true)
    }else{
        setSelectedCategory(e.target.value)
    }
}

function handleRowClick(row){
    setSelectedTransaction(row.key)
    setSelectedDate(row.date);
    setSelectedCategory(row.category);
    setSelectedDescription(row.description);
    setSelectedAmount(row.amount);
    getAllCategories();
}

function handleOnCloseClick(){
    setEditingSelected(false);
    setSelectedTransaction("");
    setSelectedTransaction("")
    setSelectedDate("");
    setSelectedCategory("");
    setSelectedDescription("");
    setSelectedAmount("");
    setNewCategory("");
    setNewCategoryToggle(false);
}

async function saveTransaction(){
    if(newCategoryToggle === true){
        try{
            await Axios.post('/api/categories/create-new-category', {name: newCategory});
            setSelectedCategory(newCategory);
            await getAllCategories();
            }catch(e){
                console.log(e)
            }
    }
    const convDate = selectedDate.split("-");
    const dateObj = {
        year: +convDate[0],
        month: +convDate[1],
        day: +convDate[2],
    }
    try{
        const updatedInfo = {
        date: dateObj,
        category: newCategory || selectedCategory,
        description : selectedDescription,
        amount : selectedAmount,
        }
    await Axios.put(`api/transactions/edit-transaction/${selectedTransaction}`, updatedInfo)
    handleOnCloseClick();
    handleGetTransactionsByMonth();
    }catch(e){
        console.log(e)
        handleOnCloseClick();
    }
}

async function handleDelete(event){
    event.preventDefault();
    try{
        await Axios.delete(`api/transactions/delete-transaction/${selectedTransaction}`)
        setSelectedTransaction("");
        handleGetTransactionsByMonth();
    }catch(e){
        console.log(e)
    }
}



function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  selectedTransaction: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { selectedTransaction } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selectedTransaction && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
        <Tooltip title="Add Transaction">
            <IconButton onClick={()=> openPopUp()}>
                <AddIcon />
            </IconButton>
        </Tooltip>
      {selectedTransaction ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Edit Transaction
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {sortingBy}
        </Typography>
      )}
      {selectedTransaction  ? (
        <>
            {!editingSelected ? (
                <>
                    <Tooltip title="Edit">
                        <IconButton onClick={()=>{setEditingSelected(true)}}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDelete} >
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </>

            ) : (
                <>
                <Tooltip title="Close">
                    <IconButton onClick={handleOnCloseClick}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Save">
                    <IconButton onClick={saveTransaction}>
                        <SaveIcon />
                    </IconButton>
                </Tooltip>
                </>
            )}
        </>
      ) : (
        <SortingMenu 
            setFilter = {setFilter}
            setSortingBy = {setSortingBy}
            getAllCategories = {getAllCategories}
            />
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  selectedTransaction: PropTypes.string.isRequired,
};


  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected,] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <EnhancedTableToolbar selectedTransaction={selectedTransaction} />
        <TableContainer>
          <Table
            sx={{ minWidth: 500 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <EnhancedTableHead
              selectedTransaction={selectedTransaction}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.key);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={()=> {
                        if(selectedTransaction !== row.key && !editingSelected){
                            handleRowClick(row)
                        }else if(selectedTransaction !== row.key && editingSelected){
                            handleOnCloseClick()
                        } }}
                    role="radio"
                    aria-checked={selectedTransaction === row.key}
                    tabIndex={-1}
                    key={row.key}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Radio
                        onClick={()=> 
                            selectedTransaction !== row.key ? setSelectedTransaction(row.key) : setSelectedTransaction("")
                        }
                        color="primary"
                        checked={selectedTransaction === row.key}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                        {editingSelected && selectedTransaction === row.key ? (
                            <TextField 
                            id="dateText" 
                            type={'date'} 
                            label="Date" 
                            variant="standard" 
                            value={selectedDate}  
                            onChange={handleOnChange}/>
                        ) : 
                        (row.date)
                        }
                      
                    </TableCell>
                    <TableCell align="left">
                        {editingSelected && selectedTransaction === row.key && row.type !== 'Income' ? 
                            renderedList : 
                        (row.category || row.type)}
                    </TableCell>
                    <TableCell align="left">
                        {editingSelected && selectedTransaction === row.key ? (
                            <TextField 
                            id="descriptionText" 
                            type={'text'} 
                            label="Description" 
                            variant="standard" 
                            value={selectedDescription}
                            onChange={handleOnChange}/>
                        ) : 
                        (row.description)}
                    </TableCell>
                    <TableCell align="right">
                        {editingSelected && selectedTransaction === row.key ? (
                            <TextField 
                            id="amountText" 
                            type={'text'}
                            label="Amount" 
                            variant="standard" 
                            value={selectedAmount}
                            onChange={handleOnChange}/>
                        ) : 
                        (row.amount)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (33) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default TransactionList;