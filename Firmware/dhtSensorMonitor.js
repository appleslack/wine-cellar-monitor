
const TestMode = process.platform === 'darwin' ? true : false;
var sensorLib = undefined;
if( !TestMode ) {
    sensorLib = require('node-dht-sensor');
}

const sensorType = 22;

class dhtSensorMonitor {
    constructor() {
        this.pin = 0;
        this.interval = 60;
        this.measurementsPerReading = 0;
        this.initialized = false;
        this.firedCallback = undefined;
    }

    initializeMonitor( initializedCallback ) {
        if( TestMode == false ) {
            if (!sensorLib.initialize(sensorType, this.pin)) {
                console.warn('Failed to initialize sensor');
                initializedCallback(false);
            }
            else {
                this.initialized = true;
            }
        }
        else {
            initializedCallback(true);
            this.initialized = true;
        }


        // setTimeout(initializedCallback,
        //     1000);
    }

    startMonitor() {
        this.isRunning = true;

        if( this.initialized ) {
            this.takePeriodicReading(); 
        }
    }
    stopMonitor() {
        this.isRunning = false;
    }

    // Measurments array
    // [   {temp: 70.9, humidity: 53}, 
    //     {temp: 71.2, humidity: 52}, 
    //     {temp: 71.7, humidity: 51.2}, 
    // ];

    takePeriodicReading = () => {
        
        if( !this.isRunning ) {
            return;
        }
        var readings = {};

        readings.timestamp = new Date();
        if( TestMode ) {
            console.log('Taking periodic reading now (TEST mode)');

            // Generate fake measurements in array
            readings.temperature = (22.0 + Math.random()).toFixed(1);
            readings.humidity = (49.4 + Math.random()).toFixed(1);
        }
        else {
            console.log('Taking periodic reading now');

            var sensorData = sensorLib.read();
            readings.temperature = sensorData.temperature.toFixed(1);
            readings.humidity = sensorData.humidity.toFixed(1);
        }
        // console.log('Temperature:', readings.temp + 'C');
        // console.log('Humidity:   ', readings.humidity + '%');

        // Now inform the parent that there's new data (using callbacks for now at least)
        if( this.firedCallback ) {
            this.firedCallback( 'temp-reading', readings);
        }

        // Then call recursively if we're still running
        setTimeout( this.takePeriodicReading,
            this.interval * 1000);
    }

    addTempMonitor( pin, firedCallback, interval, measurementsPerReading ) {
        this.pin = pin;
        this.interval = interval;
        this.measurementsPerReading = measurementsPerReading;
        
        this.firedCallback = firedCallback;

        console.log('Adding Temperature and Humidity monitor firing every ' + interval + ' seconds');
        
    }
}
module.exports = dhtSensorMonitor;

