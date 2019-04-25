import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import Album from './components/Album.js';

class App extends Component {
  render() {
    return (
      <div className ="App">
        <header>
          <nav>
            <h1>Music Player</h1>
          </nav>
        </header>
        <main>
          <Route exact path='/' component={Album} />
        </main>
      </div>
    );
  }
}

export default App;
