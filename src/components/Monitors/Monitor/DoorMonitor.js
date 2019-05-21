import React, {Component} from 'react';
import classes from './DoorMonitor.module.css';

class DoorMonitor extends Component {
  render () {
    <div className={[ classes.Monitor, classes.DoorMonitor].join(' ')}>
      Door Monitor
    </div>
  }
}

export default DoorMonitor;
