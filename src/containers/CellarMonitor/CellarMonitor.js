import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Monitors from '../../components/Monitors/Monitors';
import StatusMonitor from '../../components/Monitors/Monitor/StatusMonitor';

// const INGREDIENT_PRICES = {
//   lettuce : 0.5,
//   cheese :  0.65,
//   meat:     1.95,
//   bacon:    0.75
// }

class CellarMonitor extends Component {
  constructor(props) {
    console.log('CellarMonitor constructor');

    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    let state = {
      temperature : 65.4,
      humidity : 45,
      doorOpen : false,
      temperatureUnit : 'farenheit',
      connected : false,
      connecting : false,
      error : null
    }
    return state;
  }

  componentDidMount = () => {
    console.log('CellarMonitor componentDidMount');

    setTimeout( () => {
      this.connectToAWS();
    }, 1000);

  }

  connectToAWS = () => {
    console.log('Connecting to AWS...');
    this.setState( {connecting: true });

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
      this.setState( {connected: true, connecting:false});

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
  }

  render () {
    return (
      <React.Fragment>
        <Monitors currentState={this.state}/>
        <StatusMonitor
          connecting={this.state.connecting}
          connected={this.state.connected}
        />
      </React.Fragment>
    );
  }
}

export default CellarMonitor;
