import React, {Component} from 'react';
import classes from './TemperatureMonitor.module.css';

class TemperatureMonitor extends Component {
  render () {
    <div className={[ classes.Monitor, classes.TemperatureMonitor].join(' ')}>
      Temperature Monitor
    </div>
  }
}

export default TemperatureMonitor;
