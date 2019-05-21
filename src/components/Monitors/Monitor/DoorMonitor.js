import React, {Component} from 'react';
import classes from './DoorMonitor.module.css';
import baseclasses from './Monitor.module.css';

class DoorMonitor extends Component {
  render () {
    return (
      <div className={[ baseclasses.Monitor, classes.DoorMonitor].join(' ')}>
        Door Monitor
      </div>
    );
  }
}

export default DoorMonitor;
