
const AWS = require('aws-sdk');
const AWSIoTSDK = require('aws-iot-device-sdk');

const dotenv = require('dotenv');
dotenv.config();

let awsConfig = {
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  mqttEndpoint: `${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com`,
  region: process.env.REACT_APP_REGION,
  clientId: process.env.clientId,
  userPoolId: process.env.REACT_APP_USER_POOL_ID
};

console.log(awsConfig);

// var cellarShadow = AWSIoTSDK.thingShadow(
//   {
//     keyPath: ~/certs/ef010fc241-private.pem.key,
//     certPath: ~/certs/ef010fc241-certificate.pem.crt,
//     caPath: ~/certs/AmazonRootCA1.pem,
//     clientId: 'TestUpdateClient',
//     host:
//   }

// )
