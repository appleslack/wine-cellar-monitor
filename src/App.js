import React, { Component } from 'react';
import './App.css';

import Layout from './components/Layout/Layout'
import CellarMonitor from './containers/CellarMonitor/CellarMonitor';

class App extends Component {
    render() {
        return (
          <div className="App">
            <header className="App-header">
            <Layout>
              <CellarMonitor />
            </Layout>
            </header>
          </div>
        );
    }
}

export default App;
