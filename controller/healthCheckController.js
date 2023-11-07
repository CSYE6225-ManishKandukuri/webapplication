const express = require('express');
const sequelize = require('../database.js');
const router = express.Router();
const log = require('../logger/logs.js');


const checkHealth = async (req,res) => 
{
    //console.log("inside the healthchecker");

    const status = await checkConnection();
    //console.log(status);
    
    if (status)
    {
        log.info('This is an example log message in your code');
        res.status(200).json();
    }
    else
    {
        log.info('This is an example log message in your code');
        res.status(503).json();
    }

    
}

const rejectOtherMethods = async (req,res) =>
{
    res.status(405).json();
}

  
async function checkConnection ()
{
    //console.log("eafVAFV");
    try{
        await sequelize.authenticate();
        return true
    }
    catch (error)
    {
        //console.error(error);
        return false;
    }
}


module.exports = { checkHealth, rejectOtherMethods };