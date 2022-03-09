import './percentage.css'
import React from 'react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {Dropdown, Container, Row, Col, Form, Card} from 'react-bootstrap'
import JsonCurrency from './currency.json'  




const percentageHandler = (amount, percentage) => {

    if(isNaN(amount) || isNaN(percentage))
        return "Percentage can only work with numbers" ;
    amount = Number(amount);
    percentage = Number(percentage)
    const negativePercentage = (amount - (amount * percentage) / 100) ;
    const positivePercentage = (amount + (amount * percentage) / 100) ;

    const value = {negativePercentage, positivePercentage}
    return value;
}


    
const getCurrencyHandler = async () =>{

    try{
        const currencyFetch = await axios.get('https://pacific-basin-11511.herokuapp.com/allcurrency');
        if(currencyFetch.data.data.data){
            return currencyFetch.data.data.data;
        }
        return currencyFetch.data;
    }
    catch(error){
        console.log(error.message, 'error')
        return {data: ''}
    }   
}

const handleCurrency = (currency, jsonData)=>{
   const currencyArr = [...jsonData ] 
    currency = currency.toUpperCase()
   const data = currencyArr.filter((item)=>{
         return item.symbol.includes(currency)
    });

    console.log(data)
    return data;
}

 
const PercentageDisplay = (props)=>{

    const [amount, setAmount] = useState(100)
    const [percentage, setPercentage] = useState(10)
    let [result, setResult] = useState(percentageHandler(amount, percentage))

    const handleSearch = ()=> {
        const search = document.getElementById('search');
        search.value = '';
    }
    
   
    useEffect(()=>{
        setResult(percentageHandler(amount, percentage))
    }, [amount, percentage])



    
    const [currencyName, setCurrencyName] = useState('Currency')
    const [filteredCurrency, setfilteredCurrency] = useState('')
    const [currency, setCurrency] = useState([]);
    const [currencyArr, setCurrencyArr] = useState([])

    useEffect( ()=>{
        const fetchData = async ()=>{
            const data =  await getCurrencyHandler();
            // console.log(data)
            if(!data.data && typeof(data.data) === 'string'){ // This will serve Old price
                setCurrency(JsonCurrency.data)
                setCurrencyArr(JsonCurrency.data)
            }
            else{ // This will serve new price
                setCurrency(data);
                setCurrencyArr(data)
            }         
        } 
      
        fetchData()
        
    }, [currencyName])

    useEffect(()=>{


        setCurrency(handleCurrency(filteredCurrency, currencyArr))


        return () =>{
            window.removeEventListener('change', setfilteredCurrency);
            window.removeEventListener('click', handleSearch);
        }

    }, [filteredCurrency])
 
     

    return(
    <Container fluid>

             <Card className = 'p-1 mb-3 '> 
                 <Col xs = {12}   >
                 <Card className = 'p-1 mb-1' > CRYPTO CURRENCY PERCENTAGE CALCULATOR</Card>
                </Col>

                <Col xs= {12}>
                     <div id ='result' >  {result.negativePercentage.toFixed(3) } {'<<<<'} LB/UB 
                          {' >>>>'}  {result.positivePercentage.toFixed(3)} 
                     </div>
                </Col>
            </Card>

         <Form>
            <Row>
                <Col xs = {12} md ={6}>
                <Form.Group className = 'mb-3  form-group' xs = {12} controlId = 'formAmount'> 
                        <Form.Label xs = {2}  className = 'form-label'> $ </Form.Label>
                        <Form.Control xs = {10} type = 'text' value = {amount} onChange = {(event)=>setAmount(event.target.value) }/>     
                </Form.Group>
                </Col>

                <Col xs = {12} md = {6}>
                <Form.Group className = 'mb-3 form-group' xs = {12} controlId = 'formPercentage'> 
                        <Form.Label xs = {4} className = 'form-label'> % </Form.Label>
                        <Form.Control xs = {8} type = 'text' value = {percentage} onChange = {(event)=>setPercentage(event.target.value) }/>     
                </Form.Group>
                </Col>

                <Col xs = {12} >
                    <p> Select your Currency </p>
                     <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                   {currencyName}
                </Dropdown.Toggle>
                
                

                <Dropdown.Menu >
                   <Form.Control id = "search"  type = 'search' placeholder='Search Currency' onChange = {(event)=> { 
                        setfilteredCurrency(event.target.value)
                        
                     }
                   }/>    
                { 
                  
                    typeof(currency) === 'object' ? 
                    currency.map((item) =>{
                    return <Dropdown.Item
                      key ={item.id} onClick = {()=> {
                        setCurrencyName(item.symbol); 
                        setAmount(item.quote.USD.price)
                        handleSearch();
                        }
                    }
                      href="#"> 
                      {item.symbol}
                      </Dropdown.Item>
                }) : null}
                </Dropdown.Menu>
                     </Dropdown>
                    
                </Col>
           </Row>
       </Form>

    </Container>
    )
}




export default PercentageDisplay
