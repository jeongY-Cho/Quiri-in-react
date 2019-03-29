import React, {Component} from "react"
import TagPanel from "./panels/tagPanel.js"
import CardPanel from "./panels/cardPanel.jsx"
import CommentPanel from "./panels/commentPanel.js"


// initialize firebase
var config = {
    apiKey: "AIzaSyACuA8CM5fKm59JMMeE72gNadh6yVCdyvc",
    authDomain: "cards-5c8be.firebaseapp.com",
    databaseURL: "https://cards-5c8be.firebaseio.com",
    projectId: "cards-5c8be",
    storageBucket: "cards-5c8be.appspot.com",
    messagingSenderId: "222433486904"
  };
const firebase = require("firebase")
require("firebase/firestore")
firebase.initializeApp(config)
let db = firebase.firestore()

class PanelGroup extends Component {
  constructor(props) {
    super(props)

    this.increment = this.increment.bind(this)
    this.searchTags = this.searchTags.bind(this)

    let tagPanel = {
      type: "tags",
      title: "Tags",
      state: "extended",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick:this.searchTags,
    }
    let cardPanel = {
      type: "cards",
      title: "Cards",
      state: "extended",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick:this.increment,
      inc: 0
    }
    let commentPanel = {
      type: "comments",
      title: "Comments",
      state: "extended",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick: this.increment,
      inc: 0
    }


    this.state = {
      tagPanel: tagPanel,
      cardPanel: cardPanel,
      commentPanel: commentPanel
    }
  }

  increment(e) {
    console.log(e.target);
    let panel = Object.assign({}, this.state[e.target.id])
    panel.listItems.items.push("thing ")

    this.setState({
      [e.target.id]: panel
    })
  }

  async searchTags(e) {
    let tag = e.target.id
    let cards = await db.collection("Active").doc(tag).collection("cards").get()
    cards = cards.docs

    cards = cards.map(card => {
      let data = card.data()

      let question = data.question
      let body = data.body
      if (body.length === 100) {
        body = body.substring(0, 100) + "..."
      }
      let answered = data.answered
      let timeCreated = data.timeCreated

      return {
        id: card.id,
        question,
        body,
        answered,
        timeCreated
      }
    })

    console.log(cards);
    let cardPanel = Object.assign({}, this.state.cardPanel)

    cardPanel.listItems.items = cards

    this.setState({
      cardPanel:cardPanel
    })
  }

  async componentDidMount() {

    let tags = await db.collection("Active").get()
    tags = tags.docs.map(tag => {
      return {
        tag:tag.id,
        id:tag.id
      }
    })
    console.log(tags);

    let panel = Object.assign({}, this.state.tagPanel)

    panel.listItems.items = tags
    this.setState({
      tagPanel:panel
    })
  }
  render() {

    return (
      <div className="container">
        <TagPanel type={this.state.tagPanel.type} state={this.state.tagPanel.state} onClick={this.state.tagPanel.onClick} id="tagPanel" listItems={this.state.tagPanel.listItems}/>
        <CardPanel type={this.state.cardPanel.type} state={this.state.cardPanel.state} onClick={this.state.cardPanel.onClick} id="cardPanel" listItems={this.state.cardPanel.listItems}/>
        <CommentPanel type={this.state.commentPanel.type} state={this.state.commentPanel.state} onClick={this.state.commentPanel.onClick} id="commentPanel" listItems={this.state.commentPanel.listItems}/>
      </div>
    )
  }
}


export default PanelGroup
