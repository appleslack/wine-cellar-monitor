
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
