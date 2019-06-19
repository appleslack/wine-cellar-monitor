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
      temperature : undefined,
      humidity : undefined,
      doorOpen : undefined,
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

  handleMessageReceived = (msg) => {
    var newState = {};
    console.log(msg);

    if( msg.state.reported.temperature !== undefined ) {
      newState.temperature = msg.state.reported.temperature;
    }
    if( msg.state.reported.humidity !== undefined ) {
      newState.humidity = msg.state.reported.humidity;
    }
    if( msg.state.reported.doorOpen !== undefined ) {
      newState.doorOpen = msg.state.reported.doorOpen;
    }

    this.setState( newState );

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
      mqttClient.subscribe('$aws/things/WineCellarMonitor/shadow/update');

      // To get the current state when connecting to IoT, publish to /get and subscribe
      // to /get/accepted.  The state will be published on the /get/accepted topic to
      // give the current state...
      mqttClient.subscribe('$aws/things/WineCellarMonitor/shadow/get/accepted');
      mqttClient.publish( '$aws/things/WineCellarMonitor/shadow/get' );
    });

    mqttClient.on('error', (err) => {
      console.log('mqttClient error:', err)
    });

    mqttClient.on('message', (topic, payload) => {
      const msg = JSON.parse(payload.toString());
      console.log('mqttClient message: ', msg);

      this.handleMessageReceived(msg);
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
