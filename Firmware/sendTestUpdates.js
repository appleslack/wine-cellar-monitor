
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
    var theState = {
      state: {
        temperature: 54.4,
        humidity: 34.5,
        doorOpen: true
      }
    }

    this.stateObject = theState;

    if( args.doorOpen != undefined ) {
      console.log('Door open: ', args.doorOpen);
      if( args.doorOpen === 'true') {
        this.stateObject.state.doorOpen = true;
      }
      else {
        this.stateObject.state.doorOpen = false;
      }
    }
    if( args.temperature != undefined ) {
      console.log('Temperature: ', args.temperature);
      this.stateObject.state.temperature = args.temperature;
    }
    if( args.humidity != undefined ) {
      console.log('Humidity', args.humidity);
      this.stateObject.state.humidity = args.humidity;
    }

    console.log('State Object is ', this.stateObject);
  }

  start() {
    console.log('Starting');

    this.shadow = AWSIoTSDK.device(
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

    this.shadow.on('connect', () => {
       console.log('connected to AWS IoT');
       this.handleConnected();
    });
    this.shadow.on('close', () => {
       console.log('close');
       this.shadow.unregister(thingName);
    });

    this.shadow.on('reconnect', () => {
       console.log('reconnect');
    });

    this.shadow.on('offline', () => {
       //
       // If any timeout is currently pending, cancel it.
       //
       if (currentTimeout !== null) {
          this.clearTimeout(currentTimeout);
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

    this.shadow.on('status', (thingName, stat, clientToken, stateObject) => {
       this.handleStatus(thingName, stat, clientToken, stateObject);
    });

    this.shadow.on('delta', (thingName, stateObject) => {
       this.handleDelta(thingName, stateObject);
    });

    this.shadow.on('timeout', (thingName, clientToken) => {
       this.handleTimeout(thingName, clientToken);
    });

    this.shadow.on('message', (topic, payload) => {
       this.handleMessage(topic, payload);
    });

  }
  /*
  Sending new update now...
  UPDATE: $aws/things/WineCellarMonitor/shadow/update/#
  payload = {"state":{"reported":{"temperature":78}},"metadata":{"reported":{"temperature":{"timestamp":1558719519}}},"version":43,"timestamp":1558719519,"clientToken":"4acdf048-0ccd-4dc9-8d5e-304548db8fa7"}
  */

  publishState( stateObject, topic ) {

    const message=JSON.stringify(stateObject);

    // const message = JSON.stringify({
    //    message: 'state ' +
    //       JSON.stringify(stateObject)
    // });

    console.log('Publishing message: ', message);
    this.shadow.publish('$aws/things/WineCellarMonitor/shadow/update', message);

  }
  // Handlers for each mqtt callbacks

  handleConnected() {
    // this.shadow.register( TEMP_STATUS_TOPIC, () => {
    //   console.log('Registered for topic '+ TEMP_STATUS_TOPIC);
    // });
    //
    // this.shadow.register( HUMIDITY_STATUS_TOPIC, () => {
    //   console.log('Registered for topic '+ HUMIDITY_STATUS_TOPIC);
    // });
    //
    // this.shadow.register( DOOR_STATUS_TOPIC, () => {
    //   console.log('Registered for topic '+ DOOR_STATUS_TOPIC);
    // });
    //
    // Publish the message after 1/2 second wait

    setTimeout( () => {
       this.publishState(this.stateObject, TEMP_STATUS_TOPIC);
    }, 500);


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
