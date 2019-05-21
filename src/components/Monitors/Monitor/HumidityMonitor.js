import React, {Component} from 'react';
import classes from './HumidityMonitor.module.css';

class TemperatureMonitor extends Component {
  render () {
    <div className={[ classes.Monitor, classes.HumidityMonitor].join(' ')}>
      Temperature Monitor
    </div>
  }
}

export default HumidityMonitor;
