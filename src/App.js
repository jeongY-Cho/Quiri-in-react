import React, { Component } from 'react';
import './App.css';
import PanelGroup from "./panelGroup.js"
import {Title} from "./panels.js"



class App extends Component {
  render() {
    let someone = "Someone"
    return (
      <div className="App">
        <Title name={someone}/>
        <PanelGroup />
      </div>
    );
  }
}

export default App;
