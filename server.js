
const express = require('express');
const axios = require('axios')
const cors = require('cors')
const path = require("path");
const app = express();

require('dotenv').config();
app.use(cors());

app.use('/', express.static(`${__dirname}/client/build`))

// app.get('/', (res, req) =>{

//   res.send('we are here')

// })

const CMC_API_KEY = process.env.CMC_API_KEY; //COIN MARKET CAP API KEY 
app.get('/allcurrency', async (req, res) =>{
    
    try{
        const fetchCurrency = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',{
             qs: {
               'start': '1',
               'limit': '5000',
               'convert': 'USD'
             },
             headers: {
               'X-CMC_PRO_API_KEY': CMC_API_KEY
             },
             json: true,
             gzip: true
     
        })
       // console.log(fetchCurrency.data)
      if(fetchCurrency.data){
          return res.json({data: fetchCurrency.data});
      }

      return res.json({data: null})
     

    }

    catch(error){
        console.log(error);
        res.status(500).json({status: 'failed', message: 'Couldnt fetch data', data: null})
    }
   


})


const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`APP RUNNUNG ON ${port} `)
})