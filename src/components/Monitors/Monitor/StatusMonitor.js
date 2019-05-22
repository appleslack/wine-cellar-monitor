import React from 'react';
import classes from './StatusMonitor.module.css';
import baseclasses from '../Monitors.module.css';

const statusMonitor = (props) => {
  let status = null;
  if( props.connecting ) {
    status=<p>Status: Connecting</p>
  }
  if( props.connected ) {
    status=<p>Status: Connected</p>
  }
  else {
    status=<p>Status: Disconnected</p>
  }
  

  return (
    <div className={[classes.StatusMonitor, baseclasses.Monitor].join(' ')}>
      {status}
    </div>
  );
}

export default statusMonitor;
