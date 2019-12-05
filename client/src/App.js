import React from "react";
import "./App.css";
import { MapElement } from "./MapElement";
import { Home } from "./Home";
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
