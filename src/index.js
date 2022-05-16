require('dotenv').config()
const express = require('express')
const Router = require('../routes/router')
const app = express()

const port = process.env.PORT_APP 

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/',Router)




app.listen(port,()=>{
    console.log(`server is listening to the port number ${port}`);
})