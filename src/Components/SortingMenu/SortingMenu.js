import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList'
import zIndex from '@mui/material/styles/zIndex';

function SortingMenu({setFilter, setSortingBy}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setFilter(event.target.id)
    switch(event.target.id){
      case "allTransactionsSort":
        setSortingBy('All Transactions')
        break;
      case "incomeSort":
        setSortingBy("Income")
        break;
      case "expensesSort":
        setSortingBy('Expenses')
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
      sx={{zIndex: 1600}}
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