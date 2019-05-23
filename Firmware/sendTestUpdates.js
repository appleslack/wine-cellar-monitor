
const AWS = require('aws-sdk');
const AWSIoTSDK = require('aws-iot-device-sdk');
const dotenv = require('dotenv');
const minimist = require('minimist')

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
      keyPath: '~/certs/ef010fc241-private.pem.key',
      certPath: '~/certs/ef010fc241-certificate.pem.crt',
      caPath: '~/certs/AmazonRootCA1.pem',
      clientId: awsConfig.clientId,
      host: awsConfig.mqttEndpoint,
      region: awsConfig.region,
    }
  );
  AWS.config.region = awsConfig.region;

  return shadow;
}

mainApp = (args) => {
  console.log(args);
  console.log(  );
}

var args = minimist(process.argv.slice(2));
mainApp(args);
