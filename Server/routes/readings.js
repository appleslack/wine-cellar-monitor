const serverConfig = require( '../util/config');


/*
    This is the API for getting the historical measurement data (readings)from
    the NoSQL database (currently MongoDB).  The data is not inserted 
    via this API, instead it's stored as a result of an IoT operation from
    the device sending it to the cloud.

    Current operations are:
    1. Get all readings (temperature and humitidy both outside and inside).
    2. Get a range of readings data (last 5 days for example)
    3. Get all door status change events
*/

const express = require('express');
// Use a validator
const {body} = require( 'express-validator/check');

const measurementsController = require('../controllers/readings');

const router = express.Router();

// GET /readings/tandh
router.get('/tandh', measurementsController.getTempAndHumitidyReadings);
router.post('/tandh', measurementsController.postTempAndHumitidyReadings);

// PUT (for testing only)
console.log('Server Config: ', serverConfig);

if( serverConfig.TESTING_MODE === true ) {
    console.log('In testing mode');
}

module.exports = router;

