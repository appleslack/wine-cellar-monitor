import React, {Component} from 'react';
import classes from './DoorMonitor.module.css';
import baseclasses from './Monitor.module.css';
import doorClosedImg from '../../../assets/images/door-closed.png';
import doorOpenedImg from '../../../assets/images/door-opened.png';

class DoorMonitor extends Component {

  render () {
    return (
      <div className={[ baseclasses.Monitor, classes.DoorMonitor].join(' ')}>
        <img src={this.props.currentState.doorOpen ? doorOpenedImg : doorClosedImg}></img>
      </div>
    );
  }
}

export default DoorMonitor;
