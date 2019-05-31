
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
            this.initialized(success);
        });
        this.monitor.startMonitor();
    }
    // Undo the listening on the gpio pins, etc.
    stop() {

    }

    addMonitorType( monitorType, pin, interval, readingsperInterval  ) {

        if( monitorType === 'temp' ) {
             this.monitor.addTempMonitor(pin, this.fired, interval, readingsperInterval);
         }
         else if( monitorType === 'door' ) {
             this.monitor.addDoorMonitor(pin, this.fired);
         }
    }

    // setCallbacks(initialized, fired, error) {
    //     this.initializedCallback = initialized;
    //     this.firedCallback = fired;
    //     this.sensorErrorCallback = error;

    // }
    // Want to schedule some readings to be taken every X seconds.

    // initialized
    initialized = (success) => {
        console.log('callback:  initialized');
        sensorMonitor.emit( 'initialized', success);
        
    };

    // fired
    fired = (type, readings) => {
        // console.log('Callback: fired.  Type: ', type);
        
        if( type === 'temp-reading') {
            sensorMonitor.emit('temp-reading', readings.temp, readings.humidity);
        } 

    };

    // error
    error = (error) => {
        console.log('callback:  error');
    };

}

module.exports = SensorMonitor;
const sensorMonitor = new SensorMonitor('dht-sensor');


const periodicInterval = 4;        // Every minute
const numReadingsPerInterval = 4;   // Num readings to get average value before firing
const tempAndHumidityGPIOPin = 4;   // The gpio pin for temp and humidity reading
const doorOpenEventGPIOPin = 11;    //

sensorMonitor.addMonitorType( 'temp',  tempAndHumidityGPIOPin, periodicInterval, numReadingsPerInterval);
// sensorMonitor.addMonitorType( 'door', doorOpenEventGPIOPin);

sensorMonitor.start();

sensorMonitor.on('temp-reading', function(temp, humidity) {
    console.log( 'New Sensor Reading:  Temperature - ' + temp + ' Humidity - ' + humidity );
});

sensorMonitor.on( 'door-status', function( doorOpenStatus ) {
    console.log( 'New Sensor Reading:  Door is ' + doorOpenStatus ? 'OPEN' : 'CLOSED');
});

