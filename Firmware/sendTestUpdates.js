
const AWS = require('aws-sdk');
const AWSIoTSDK = require('aws-iot-device-sdk');
const dotenv = require('dotenv');
// const minimist = require('minimist')

getWineCellarShadow = () => {
  dotenv.config();

  let awsConfig = {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    mqttEndpoint: `${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com`,
    region: process.env.REACT_APP_REGION,
    clientId: 'raspberryPiClient',
    userPoolId: process.env.REACT_APP_USER_POOL_ID
  };

  console.log(awsConfig);

  let shadow = AWSIoTSDK.thingShadow(
    {
      keyPath: '/Users/stu/certs/ef010fc241-private.pem.key',
      certPath: '/Users/stu/certs/ef010fc241-certificate.pem.crt',
      caPath: '/Users/stu/certs/AmazonRootCA1.pem',
      clientId: awsConfig.clientId,
      host: awsConfig.mqttEndpoint,
      region: awsConfig.region,
    }
  );
  AWS.config.region = awsConfig.region;

  return shadow;
}


mainApp = (args) => {
  const thingShadow = getWineCellarShadow();

  thingShadow.on('connect', function() {
     console.log('connected to AWS IoT');
  });

  thingShadow.on('close', function() {
     console.log('close');
     thingShadow.unregister(thingName);
  });

  thingShadow.on('reconnect', function() {
     console.log('reconnect');
  });

  thingShadow.on('offline', function() {
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

  thingShadow.on('error', function(error) {
     console.log('error', error);
  });

  thingShadow.on('message', function(topic, payload) {
     console.log('message', topic, payload.toString());
  });

  thingShadow.on('status', function(thingName, stat, clientToken, stateObject) {
     handleStatus(thingName, stat, clientToken, stateObject);
  });

  thingShadow.on('delta', function(thingName, stateObject) {
     handleDelta(thingName, stateObject);
  });

  thingShadow.on('timeout', function(thingName, clientToken) {
     handleTimeout(thingName, clientToken);
  });

  thingShadow.on('message', function(topic, payload) {
     handleMessage(topic, payload);
  });

  thingShadow.register('TemperatureStatus', {
     persistentSubscribe: true
  });
  thingShadow.register('HumidityStatus', {
     persistentSubscribe: true
  });
  thingShadow.register('DoorStatus', {
   persistentSubscribe: true
});


  if( args.doorOpen != undefined ) {
    console.log('Door open: ', args.doorOpen);
  }
  if( args.temperature != undefined ) {
    console.log('Temperature: ', args.temperature);
  }
  if( args.humidity != undefined ) {
    console.log('Humidity', args.humidity);
  }

  thingShadow.on('connect', () => {
    console.log('Shadow Client Connected')
  });

}

const args = require('minimist')(process.argv.slice(2));


mainApp(args);
