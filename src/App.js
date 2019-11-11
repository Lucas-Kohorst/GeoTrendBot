import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MapElement } from './MapElment'
import { Home } from './Home'
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/:hashtag" component={MapElement}></Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Router>
    </div>
  );
}

export default App;
