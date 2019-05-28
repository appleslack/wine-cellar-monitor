
const JohnnyFiveMonitor = require('./johnnyFiveMonitor');
const OnOffMonitor  = require('./onOffMonitor');

const monitorType = {
    JOHNNY_FIVE : 'johnny-five',
    ON_OFF : 'on-off'
}

// Aguments:
// monitorType:  Use either the johnny-five module or the onoff one.  Just for fun.
class SensorMonitor {
    
    constructor(useMonitor) {
        console.log('sensorMonitor constructor');
        var monitor = undefined;

        if( useMonitor === monitorType.JOHNNY_FIVE ) {
            console.log('Using JOHNNY_FIVE monitor');
            monitor = new JohnnyFiveMonitor();
        }
        else {
            monitor = new OnOffMonitor();
        }
        monitor.initializeMonitor( () => {
            console.log('Initialized!!!');
        });
    }
}
module.exports.SensorMonitor = SensorMonitor;
