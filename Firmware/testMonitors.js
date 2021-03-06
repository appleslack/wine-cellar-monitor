// jshint esversion: 6

const SensorMonitor = require('./SensorMonitor');

const sensorMonitor = new SensorMonitor('dht-sensor');


const periodicInterval = 4;        // Every minute
const numReadingsPerInterval = 4;   // Num readings to get average value before firing
const tempAndHumidityGPIOPin = 4;   // The gpio pin for temp and humidity reading
const doorOpenEventGPIOPin = 11;    //

sensorMonitor.addMonitorType( 'temp',  tempAndHumidityGPIOPin, periodicInterval, numReadingsPerInterval);
// sensorMonitor.addMonitorType( 'door', doorOpenEventGPIOPin);

sensorMonitor.start();

sensorMonitor.on('temp-reading', (readings) => {
    console.log( 'New Sensor Reading:  Temperature - ' + readings.temperature + ' Humidity - ' + readings.humidity );
});

sensorMonitor.on( 'door-status', ( readings ) => {
    console.log( 'New Sensor Reading:  Door is ' + readings.doorOpenStatus ? 'OPEN' : 'CLOSED');
});

