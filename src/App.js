import React, { Component } from 'react';
import './App.css';
import thing from "./comp2.js"

var {Title, PanelGroup} = thing
// console.log(Title, Panel)
// var Panel = thing.Panel



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
