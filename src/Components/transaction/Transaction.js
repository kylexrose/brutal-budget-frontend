import React from 'react'
import CustomEditHooks from '../hooks/editHooks'

function Transaction(props) {
    const {item} = props;
    const [date, dateEdit, dateOnChange, dateToggle] = CustomEditHooks(`${item.date.year} / ${item.date.month} / ${item.date.day}`);
    const [category, categoryEdit, categoryOnChange, categoryToggle] = CustomEditHooks(item.type === "Income" ? item.type : item.category);
    const [description, descriptionEdit, descriptionOnChange, descriptionToggle] = CustomEditHooks(item.description);
    const [amount, amountEdit, amountOnChange, amountToggle] = CustomEditHooks(item.type !== "Income" ? `-${item.amount}` : item.amount);
    const className = item.type === "Expense" ? "neg" : "";

    return(

        <tr key={item._id}>
            {!dateEdit 
            ? <td onClick={dateToggle}>{date}</td>
            : <input type="date" onChange={dateOnChange}/>
            }
            {!categoryEdit 
            ? <td onClick={categoryToggle}>{category}</td>
            : <input type="text" onChange={categoryOnChange}/>
            }
            {!descriptionEdit 
            ? <td onClick={descriptionToggle}>{description}</td>
            : <input type="text" onChange={descriptionOnChange}/>
            }
            {!amountEdit 
            ? <td className={className} onClick={amountToggle}>{amount}</td>
            : <input type="text" onChange={amountOnChange}/>
            }
            
            <button>Save</button>
        </tr>
    )
}

export default Transaction;
