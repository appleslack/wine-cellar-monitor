
const AWS = require('aws-sdk');
const AWSIoTSDK = require('aws-iot-device-sdk');
const dotenv = require('dotenv');
const os = require('os');

const TemperatureStatusRegistered = false;
const HumidyStatusRegistered = false;
const DoorStatusRegistered = false;

const TEMP_STATUS_TOPIC = 'TemperatureStatus';
const HUMIDITY_STATUS_TOPIC = 'HumidityStatus';
const DOOR_STATUS_TOPIC = 'DoorStatus';

class WineCellarMonitorShadow {
  constructor(args) {
    this.shadow = undefined;
    dotenv.config();

    this.awsConfig = {
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
      mqttEndpoint: `${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com`,
      region: process.env.REACT_APP_REGION,
      clientId: 'raspberryPiClient',
      userPoolId: process.env.REACT_APP_USER_POOL_ID
    };

    this.processArgs(args);
  }

  processArgs(args) {
    if( args.doorOpen != undefined ) {
      console.log('Door open: ', args.doorOpen);
    }
    if( args.temperature != undefined ) {
      console.log('Temperature: ', args.temperature);
    }
    if( args.humidity != undefined ) {
      console.log('Humidity', args.humidity);
    }
  }

  start() {
    console.log('Starting');

    this.shadow = AWSIoTSDK.thingShadow(
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

    this.shadow.on('connect', function() {
       console.log('connected to AWS IoT');
       this.handleConnected();
    });
    this.shadow.on('close', function() {
       console.log('close');
       this.shadow.unregister(thingName);
    });

    this.shadow.on('reconnect', function() {
       console.log('reconnect');
    });

    this.shadow.on('offline', function() {
       //
       // If any timeout is currently pending, cancel it.
       //
       if (currentTimeout !== null) {
          clearTimeout(currentTimeout);
          currentTimeout = null;
       }
       //
       // If any operation is currently underway, cancel it.
       //
       while (stack.length) {
          stack.pop();
       }
       console.log('offline');
    });

    this.shadow.on('error', function(error) {
       console.log('error', error);
    });

    this.shadow.on('message', function(topic, payload) {
       console.log('message', topic, payload.toString());
    });

    this.shadow.on('status', function(thingName, stat, clientToken, stateObject) {
       handleStatus(thingName, stat, clientToken, stateObject);
    });

    this.shadow.on('delta', function(thingName, stateObject) {
       handleDelta(thingName, stateObject);
    });

    this.shadow.on('timeout', function(thingName, clientToken) {
       handleTimeout(thingName, clientToken);
    });

    this.shadow.on('message', function(topic, payload) {
       handleMessage(topic, payload);
    });

  }

  handleConnected() {
    this.shadow.register( TEMP_STATUS_TOPIC, function() {
      console.log('Registered for topic '+ TEMP_STATUS_TOPIC);
    });

    this.shadow.register( HUMIDITY_STATUS_TOPIC, function() {
      console.log('Registered for topic '+ HUMIDITY_STATUS_TOPIC);
    });

    this.shadow.register( DOOR_STATUS_TOPIC, function() {
      console.log('Registered for topic '+ DOOR_STATUS_TOPIC);
    });
  }
}

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
