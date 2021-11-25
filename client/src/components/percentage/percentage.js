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
        const currencyFetch = await axios.get('https://nameless-cove-59330.herokuapp.com/allcurrency');
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

 
const PercentageDisplay = (props)=>{

    const [amount, setAmount] = useState(100)
    const [percentage, setPercentage] = useState(10)
    let [result, setResult] = useState(percentageHandler(amount, percentage))
   
    useEffect(()=>{
        setResult(percentageHandler(amount, percentage))
    }, [amount, percentage])



    const [currency, setCurrency] = useState(JsonCurrency.data);
    const [currencyValue, setCurrencyValue] = useState(null)
    const [currencyName, setCurrencyName] = useState('Currency')


    useEffect( ()=>{
        const fetchData = async ()=>{
            const data =  await getCurrencyHandler();
            console.log(data)
            if(!data.data && typeof(data.data) === 'string'){ // This will serve Old price
                setCurrency(JsonCurrency.data)
            }
            else{ // This will serve new price
                setCurrency(data);
            }         
        } 
      
        fetchData()
        
    }, [currencyName])


    return(
    <Container fluid>

             <Card className = 'p-1 mb-3 '> 
                 <Col xs = {12}   >
                 <Card className = 'p-1 mb-1' > CRYPTO CURRENCY PERCENTAGE CALCULATOR</Card>
                </Col>

                <Col xs= {12}>
                     <div id ='result' > - {result.negativePercentage} {'<<<<'} and  {'>>>>'} + {result.positivePercentage}  </div>
                </Col>
            </Card>

         <Form>
            <Row>
                <Col xs = {12} md ={6}>
                <Form.Group className = 'mb-3' xs = {2} controlId = 'formAmount'> 
                        <Form.Label> $ </Form.Label>
                        <Form.Control type = 'text' value = {amount} onChange = {(event)=>setAmount(event.target.value) }/>     
                </Form.Group>
                </Col>

                <Col xs = {12} md = {6}>
                <Form.Group className = 'mb-3' xs = {2} controlId = 'formPercentage'> 
                        <Form.Label> % </Form.Label>
                        <Form.Control  type = 'text' value = {percentage} onChange = {(event)=>setPercentage(event.target.value) }/>     
                </Form.Group>
                </Col>

                <Col xs = {12} >
                    <p> Select your Currency </p>
                     <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                   {currencyName}
                </Dropdown.Toggle>

                <Dropdown.Menu >
                { 
                
                    typeof(currency) === 'object' ? 
                    currency.map((item) =>{
                    return <Dropdown.Item
                      key ={item.id} onClick = {()=> {setCurrencyName(item.symbol); setAmount(item.quote.USD.price)} }
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
