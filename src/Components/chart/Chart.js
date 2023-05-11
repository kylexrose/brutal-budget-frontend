import React, {useEffect, useState} from "react";
import ReactEcharts from "echarts-for-react"; 

function Chart({filteredList, sortingBy, categories}) {  

  const [data, setData] = useState([]);

  useEffect(() => {
    if(sortingBy === "All Transactions"){
        const summaryObj = {Expenses: 0, Income: 0, Savings: 0};
        filteredList.forEach(transaction => {
          switch (transaction.type){
            case "Income":
              summaryObj.Income += transaction.amount;
              break;
            case "Expense":
              if(transaction.category === "Savings"){
                summaryObj.Savings += transaction.amount;
              }else{
                summaryObj.Expenses += transaction.amount;
              }
              break
            default: break;
          }
        })
        const dataArr = [
          {name: "Expenses", value: summaryObj.Expenses}, 
          {name: "Savings", value: summaryObj.Savings},
          {name: "Remaining", value: summaryObj.Income - summaryObj.Expenses - summaryObj.Savings}
        ];
        setData(dataArr);
      }else if(sortingBy === "Expenses"){
        const summaryObj = {};
        const dataArr = [];
        for(const category of categories){
          summaryObj[category.name] = 0;
        }
        filteredList.forEach(transaction => {
          if(transaction.category && summaryObj[transaction.category] !== undefined){
            summaryObj[transaction.category] += transaction.amount
          }
        })
        for(const key in summaryObj){
          dataArr.push({name: key, value: summaryObj[key]})
        }
        setData(dataArr)
      }else{
        const summaryObj = {Misc : 0};
        const dataArr = [];
        filteredList.forEach(transaction => {
          if(!transaction.description){
            summaryObj.Misc += transaction.amount
          }else if(summaryObj[transaction.description]){
            summaryObj[transaction.description] += transaction.amount;
          }else{
            summaryObj[transaction.description] = transaction.amount;
          }
        })
        for(const key in summaryObj){
          dataArr.push({name: key, value: summaryObj[key]})
        }
        setData(dataArr)
      }
    }, [sortingBy, filteredList, categories])
  
  

const option = {
  tooltip: {
  trigger: 'item'
  },
  series: [
    {
      type: 'pie',
      radius: ['30%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      responsive: true,
      maintainAspectRatio: false,
      data: data
    }
  ]
};
return <ReactEcharts option={option} style={{height:'750%', width: '750%'}} />;
} 
export default Chart;