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
        this.monitor.stopMonitor();
    }

    addMonitorType( monitorType, pin, interval, readingsperInterval  ) {

        if( monitorType === 'temp' ) {
             this.monitor.addTempMonitor(pin, this.fired, interval, readingsperInterval);
         }
         else if( monitorType === 'door' ) {
             this.monitor.addDoorMonitor(pin, this.fired);
         }
    }

    // initialized
    initialized = (success) => {
        console.log('callback:  initialized');
        this.emit( 'initialized', success);
    };

    // fired
    fired = (type, readings) => {
        // console.log('Callback: fired.  Type: ', type);
        this.emit(type, readings);
        // if( type === 'temp-reading') {
        //     this.emit('temp-reading', readings);
        // }
    };

    // error
    error = (error) => {
        console.log('callback:  error');
    };

}

module.exports = SensorMonitor;
