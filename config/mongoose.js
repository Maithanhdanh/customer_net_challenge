const ENV_VAR = require('./vars')
const { Customer } = require("../models/customer.model")
const mongoose = require('mongoose');
const logger = require('./logger');

const URL = ENV_VAR.MONGODB_URL;

mongoose.Promise = Promise;

mongoose.connection.on('error', err =>{
    logger.info(`MongoDB connection error: ${err}`)
    process.exit(-1)
})

exports.connect = () => {
    mongoose.connect(URL, { 
        useCreateIndex:true,
        keepAlive:1,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info('MongoDB connected...'));
    return mongoose.connection
}

exports.initialize= async () => {
    const uid = 1
    const newCustomer = await Customer.checkToCreateCustomer(uid)
    if(!newCustomer) return logger.info('Initialized database')
	logger.info('Initialized database done...')
}