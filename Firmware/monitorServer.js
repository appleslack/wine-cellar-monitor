
const AWS = require('aws-sdk');
const AWSIoTSDK = require('aws-iot-device-sdk');
const dotenv = require('dotenv');
const os = require('os');

const TEMP_STATUS_TOPIC = 'TemperatureStatus';

const SensorMonitor = require('./sensorMonitor');

const periodicInterval = 6;        // Every minute
const numReadingsPerInterval = 4;   // Num readings to get average value before firing
const tempAndHumidityGPIOPin = 4;   // The gpio pin for temp and humidity reading
const doorOpenEventGPIOPin = 11;    //

class WineCellarMonitorShadow {
  constructor(args) {
      this.device = undefined;
      dotenv.config();

      this.awsConfig = {
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
      mqttEndpoint: `${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com`,
      region: process.env.REACT_APP_REGION,
      clientId: 'raspberryPiClient',
      userPoolId: process.env.REACT_APP_USER_POOL_ID
      };

      this.sensorMonitor = new SensorMonitor('dht-sensor');
      this.sensorMonitor.addMonitorType( 'temp',  tempAndHumidityGPIOPin, periodicInterval, numReadingsPerInterval);
  }

  publishTemperatureReadings(readings) {
     var pubObj = {
        state: {
           reported: {...readings}
        }
     };
     const pubMsg=JSON.stringify(pubObj);
     console.log('Publishing message: ', pubMsg);
     this.device.publish('$aws/things/WineCellarMonitor/shadow/update', pubMsg);
  }

  start() {
    console.log('Starting');

    this.device = AWSIoTSDK.device(
      {
        keyPath: os.homedir()+'/certs/ef010fc241-private.pem.key',
        certPath: os.homedir()+'/certs/ef010fc241-certificate.pem.crt',
        caPath: os.homedir()+'/certs/AmazonRootCA1.pem',
        clientId: this.awsConfig.clientId,
        host: this.awsConfig.mqttEndpoint,
        region: this.awsConfig.region,
      }
    );
    AWS.config.region = this.awsConfig.region;

    this.sensorMonitor.on('temp-reading', (readings) => {
        console.log( 'New Sensor Reading:  Temperature - ' + readings.temperature + ' Humidity - ' + readings.humidity );

        this.publishTemperatureReadings(readings);
    });
    
    this.sensorMonitor.on( 'door-status', ( doorOpenStatus ) => {
        console.log( 'New Sensor Reading:  Door is ' + doorOpenStatus ? 'OPEN' : 'CLOSED');
    });
        
    this.device.on('connect', () => {
       console.log('connected to AWS IoT');
       this.handleConnected();
    });
    this.device.on('close', () => {
       console.log('close');
    });

    this.device.on('reconnect', () => {
       console.log('reconnect');
    });

    this.device.on('offline', () => {
       console.log('offline');
    });

    this.device.on('error', function(error) {
       console.log('error', error);
    });

    this.device.on('message', function(topic, payload) {
       console.log('message', topic, payload.toString());
    });

    this.device.on('status', (thingName, stat, clientToken, stateObject) => {
       this.handleStatus(thingName, stat, clientToken, stateObject);
    });

    this.device.on('delta', (thingName, stateObject) => {
       this.handleDelta(thingName, stateObject);
    });

    this.device.on('timeout', (thingName, clientToken) => {
       this.handleTimeout(thingName, clientToken);
    });

    this.device.on('message', (topic, payload) => {
       this.handleMessage(topic, payload);
    });
  }
  /*
  Sending new update now...
  UPDATE: $aws/things/WineCellarMonitor/shadow/update/#
  payload = {"state":{"reported":{"temperature":78}},"metadata":{"reported":{"temperature":{"timestamp":1558719519}}},"version":43,"timestamp":1558719519,"clientToken":"4acdf048-0ccd-4dc9-8d5e-304548db8fa7"}
  */

  handleConnected() {
       this.sensorMonitor.start();
  }

  handleStatus(thingName, stat, clientToken, stateObject) {
      var expectedClientToken = stack.pop();

      if (expectedClientToken === clientToken) {
         console.log('got \'' + stat + '\' status on: ' + thingName);
      } else {
         console.log('(status) client token mismtach on: ' + thingName);
      }

   }

   handleDelta(thingName, stateObject) {
      if (args.testMode === 2) {
         console.log('unexpected delta in device mode: ' + thingName);
      } else {
         console.log('received delta on ' + thingName +
            ', publishing on non-thing topic...');
         thingShadows.publish(nonThingName,
            JSON.stringify({
               message: 'received ' +
                  JSON.stringify(stateObject.state)
            }));
      }
   }

   handleTimeout(thingName, clientToken) {
      var expectedClientToken = stack.pop();

      if (expectedClientToken === clientToken) {
         console.log('timeout on: ' + thingName);
      } else {
         console.log('(timeout) client token mismtach on: ' + thingName);
      }

      if (args.testMode === 2) {
         genericOperation('update', generateState());
      }
   }

   handleMessage(topic, payload) {
      console.log('received on \'' + topic + '\': ' + payload.toString());
   }

} // End of class

const args = require('minimist')(process.argv.slice(2));

let wineMonitorShadow = new WineCellarMonitorShadow(args);
wineMonitorShadow.start();

// mainApp = (args) => {
//
//   this.shadow.register('TemperatureStatus', {
//      persistentSubscribe: true,
//     function () {
//       console.log('Registered successfully for TemperatureStatus Thing!');
//     }
//   });
//   this.shadow.register('HumidityStatus', {
//      persistentSubscribe: true
//   });
//   this.shadow.register('DoorStatus', {
//    persistentSubscribe: true
// });
