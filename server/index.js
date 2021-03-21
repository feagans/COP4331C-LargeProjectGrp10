const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const api = express();

api.get('/',(req,res)=>{

    res.send("Succesful Endpoint");
});
api.listen(5000,()=>console.log("Api listening"));