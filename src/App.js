import React, { Component } from 'react';
import NewCardForm from "./newCard.jsx";
import PanelGroup from "./panelGroup.js";
import Title from "./title.js";



class App extends Component {
  constructor(props) {
    super(props)

    // bind methods
    this.newCard = this.newCard.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.openDirect = this.openDirect.bind(this)

    this.state = {
      showForm: false,
  }
  }


  newCard() {
    this.setState({
      showForm: true
    })
    }

  closeForm() {
    this.setState({
      showForm: false
    })
  }

  render() {
    let someone = "Someone"
    return (
      <div className="App">
        {this.state.showForm ? <NewCardForm closeForm={this.closeForm} /> : null}
        <Title name={someone} showForm={this.newCard} tagId={this.state.tagId} cardId={this.state.cardId} />
        <PanelGroup />
      </div>
    );
  }
}

export default App;
