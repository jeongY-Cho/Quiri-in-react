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
      showForm: true,
      cardId: '',
      tagId: '',
  }
  }


  newCard() {
    this.setState({
      showForm: true
    })
    }

  closeForm(e) {

    if (e.target.id === "close") {

    } else {
      let confirm = window.confirm("Are you sure you want to leave without submitting? Your work will not be saved")
      if (!confirm) { return }
    }

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
