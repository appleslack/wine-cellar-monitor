
const JohnnyFiveMonitor = require('./johnnyFiveMonitor');
const dhtSensorMonitor  = require('./dhtSensorMonitor');

const monitorType = {
    JOHNNY_FIVE : 'johnny-five',
    ON_OFF : 'on-off'
}

console.log( 'Running on platform ', process.platform);
const TestMode = process.platform === 'darwin' ? true : false;

var EventEmitter = require('events').EventEmitter;

// Aguments:
// monitorType:  Use either the johnny-five module or the dht-sensor one.  Just for fun.
class SensorMonitor extends EventEmitter {
    
    constructor(useMonitor) {
        super();

        this.monitor = undefined;

        console.log('sensorMonitor constructor');
        this.monitor = undefined;

        if( useMonitor === monitorType.JOHNNY_FIVE ) {
            console.log('Using JOHNNY_FIVE monitor');
            
            this.monitor = new JohnnyFiveMonitor();
        }
        else {
            this.monitor = new dhtSensorMonitor();
        }
    }
    
    start() {
        this.monitor.initializeMonitor( (success) => {
            this.sensorInitialized(success);
        });
    }
    // Undo the listening on the gpio pins, etc.
    stop() {

    }

    addMonitorType( monitorType, callback, pin, interval, readingsperInterval  ) {

        if( monitorType === 'temp' ) {
             this.monitor.addTempMonitor(pin, callback, interval, readingsperInterval);
         }
         else if( monitorType === 'door' ) {
             this.monitor.addDoorMonitor(pin, callback);
         }
    }

    setCallbacks(initialized, fired, error) {
        this.initializedCallback = initialized;
        this.firedCallback = fired;
        this.sensorErrorCallback = error;

    }
    // Want to schedule some readings to be taken every X seconds.

    sensorInitialized(success)  {
        console.log('Sensor Initialized');

        // Now start reading until fail
        if( this.initializedCallback != undefined ) {
            this.initializedCallback(success);
        }
    }
}

module.exports = SensorMonitor;
const sensorMonitor = new SensorMonitor('dht-sensor');
sensorMonitor.setCallbacks( 
    // initialized
    () => {
        console.log('callback:  initialized');
        
        
    },
    // fired
    (type, readings) => {
        // console.log('Callback: fired.  Type: ', type);
        
        if( type === 'temp-reading') {
            console.log('this is ', this);
            console.log('sensorMonitor is ', sensorMonitor);
            
            sensorMonitor.emit('temp-reading', readings.temp, readings.humidity);
        } 

    },
    // error
    (error) => {
        console.log('callback:  error');

    }
);

const periodicInterval = 60;        // Every minute
const numReadingsPerInterval = 4;   // Num readings to get average value before firing
const tempAndHumidityGPIOPin = 4;   // The gpio pin for temp and humidity reading
const doorOpenEventGPIOPin = 11;    //

sensorMonitor.addMonitorType( 'temp',  sensorMonitor.firedCallback, tempAndHumidityGPIOPin, periodicInterval, numReadingsPerInterval);
// sensorMonitor.addMonitorType( 'door', this.firedCallback, doorOpenEventGPIOPin);

sensorMonitor.start();

sensorMonitor.on('temp-reading', function(temp, humidity) {
    console.log( 'New Sensor Reading:  Temperature - ' + temp + ' Humidity - ' + humidity );
});

sensorMonitor.on( 'door-status', function( doorOpenStatus ) {
    console.log( 'New Sensor Reading:  Door is ' + doorOpenStatus ? 'OPEN' : 'CLOSED');
});

// function waitForever() {
//     console.log('Waiting');

//    setTimeout( waitForever, 10000);
// }
// waitForever();

console.log('At the end');
