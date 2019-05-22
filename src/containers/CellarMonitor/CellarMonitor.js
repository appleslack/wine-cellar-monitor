import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Monitors from '../../components/Monitors/Monitors';

// const INGREDIENT_PRICES = {
//   lettuce : 0.5,
//   cheese :  0.65,
//   meat:     1.95,
//   bacon:    0.75
// }
const AWS = require('aws-sdk');
const AWSIoTData = require('aws-iot-device-sdk');

let awsConfig = {
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  mqttEndpoint: `${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com`,
  region: process.env.REACT_APP_REGION,
  clientId: process.env.clientId,
  userPoolId: process.env.REACT_APP_USER_POOL_ID
};
console.log(AWS.config.credentials);
console.log("here!");

console.log("Prcess.env.region: " + process.env.REACT_APP_REGION);

const mqttClient = AWSIoTData.device({
  region: awsConfig.region,
  host: awsConfig.mqttEndpoint,
  clientId: awsConfig.clientId,
  protocol: 'wss',
  maximumReconnectTimeMs: 8000,
  debug: false,
  accessKeyId: '',
  secretKey: '',
  sessionToken: ''
});

AWS.config.region = awsConfig.region;

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsConfig.identityPoolId
});

AWS.config.credentials.get((err) => {
    if (err) {
        console.log(AWS.config.credentials);
        throw err;
    } else {
        mqttClient.updateWebSocketCredentials(
            AWS.config.credentials.accessKeyId,
            AWS.config.credentials.secretAccessKey,
            AWS.config.credentials.sessionToken
        );
    }
});

mqttClient.on('connect', () => {
  console.log('mqttClient connected')
  mqttClient.subscribe('real-time-weather')
});

mqttClient.on('error', (err) => {
  console.log('mqttClient error:', err)
});

mqttClient.on('message', (topic, payload) => {
  const msg = JSON.parse(payload.toString());
  console.log('mqttClient message: ', msg);
});

class CellarMonitor extends Component {

  state = {
    temperature : 65.4,
    humidity : 45,
    doorOpen : false,
    temperatureUnit : 'farenheit',
    isConnected : false,
    connecting : false,
    error : null
  };

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for( let key in disabledInfo ) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    return (
      <React.Fragment>
        <Monitors currentState={this.state}/>
      </React.Fragment>
    );
  }
}

export default CellarMonitor;
