
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
        this.isRunning = true;

        if( this.initialized ) {
            this.takePeriodicReading(); 
        }

        // setTimeout(initializedCallback,
        //     1000);
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
        console.log('Taking periodic reading now');
        var readings = {};

        if( TestMode ) {
            // Generate fake measurements in array
            readings.temp = (65.0 + Math.random()).toFixed(1);
            readings.humidity = (49.4 + Math.random()).toFixed(1);
        }
        else {
            var sensorData = sensorLib.read();
            readings.temp = sensorData.temperature.toFixed(1);
            readings.humidity = sensorData.humidity.toFixed(1);
        }
        console.log('Temperature:', readings.temp + 'C');
        console.log('Humidity:   ', readings.humidity + '%');

        // Now inform the parent that there's new data (using callbacks for now at least)
        console.log('Before Calling firedCallback');
        if( this.firedCallback ) {
            console.log('Calling firedCallback');
            
            this.firedCallback( 'temp-reading', readings);
        }

        // Then call recursively if we're still running
        setTimeout( this.takePeriodicReading,
            2 * 1000);
    }

    addTempMonitor( pin, firedCallback, interval, measurementsPerReading ) {
        this.pin = pin;
        this.interval = interval;
        this.measurementsPerReading = measurementsPerReading;
        console.log('Fired callback: ', firedCallback);
        
        this.firedCallback = firedCallback;
    }
}
module.exports = dhtSensorMonitor;

