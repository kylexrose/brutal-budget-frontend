import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList'

function SortingMenu({setFilter, setSortingBy, getAllCategories}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setFilter(event.target.id);
    getAllCategories();
    switch(event.target.id){
      case "allTransactionsSort":
        setSortingBy('All Transactions')
        break;
      case "incomeSort":
        setSortingBy("Income")
        break;
      case "expensesSort":
        setSortingBy('Expenses')
        break;
      default: break;
    }
    handleClose(event)
  }

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FilterListIcon/>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleSortClick} id={"allTransactionsSort"}>All Transactions</MenuItem>
        <MenuItem onClick={handleSortClick} id={"expensesSort"}>Expenses</MenuItem>
        <MenuItem onClick={handleSortClick} id={"incomeSort"}>Income</MenuItem>
      </Menu>
    </div>
  );
}

export default SortingMenu;