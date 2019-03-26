import React, {Component} from 'react';

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


class Title extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isName: false
    }
  }

  tick() {
    this.setState(state => ({
      isName: !state.isName
    }))
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render () {
    let text;
    if (this.state.isName) {
      text = this.props.name
    } else {
      text = "Hello"
    }
    return (
      <div>
        <h1>{text}</h1>
      </div>
    )
  }
}

class Tag extends Component {
  render () {

    let tagStyle = {
      "fontSize":"30px",
      cursor:"pointer",
      "textAlign":"center"
    }
    return (
      <span style={tagStyle} onClick={this.props.onClick}><h1 className="title" id={this.props.tag}>&#9776; {this.props.tag}</h1></span>
      // <div><button onClick={this.props.onClick}><h1 className="title" id={this.props.tag}>&#9776; {this.props.tag}</h1></button></div>
    )
  }
}

class Card extends Component {
  render () {
    let answered = this.props.answered ? <p>answered</p> : null
    return (
      <span onClick={null} id={this.props.id}>
        <div className="card-body p-1">
          <h4 className="card-title text-left">{this.props.question}</h4>
          <h6 className="comment">{this.props.body}</h6>
          <p className="time">Created: {this.props.timeCreated.toDate().toString()}</p>
          {answered}
        </div>
    </span>

    )
  }
}


class Comment extends Component {
  render() {
    return (
      <div className="card comCard">
        <h5 className="comment">{this.props.comment}</h5>
        <p className="time">Time: {this.props.timeStamp}</p>
      </div>
    )
  }
}

class PanelGroup extends Component {
  constructor(props) {
    super(props)

    this.increment = this.increment.bind(this)
    this.searchTags = this.searchTags.bind(this)

    let panel1 = {
      type: "tags",
      title: "Tags",
      state: "extended",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick:this.searchTags,
    }
    let panel2 = {
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
    let panel3 = {
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
      tagPanel: panel1,
      cardPanel: panel2,
      commentPanel: panel3
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
      let body = data.body.substring(0, 100) + "..."
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
    tags = tags.docs.map(tag => tag.id)
    console.log(tags);

    let panel = Object.assign({}, this.state.tagPanel)

    panel.listItems.items = tags
    this.setState({
      panel1:panel
    })
  }
  render() {

    return (
      <div>
        <TagPanel type={this.state.tagPanel.type} state={this.state.tagPanel.state} onClick={this.state.tagPanel.onClick} id="tagPanel" listItems={this.state.tagPanel.listItems}/>
        <CardPanel type={this.state.cardPanel.type} state={this.state.cardPanel.state} onClick={this.state.cardPanel.onClick} id="cardPanel" listItems={this.state.cardPanel.listItems}/>
        <CommentPanel type={this.state.commentPanel.type} state={this.state.commentPanel.state} onClick={this.state.commentPanel.onClick} id="commentPanel" listItems={this.state.commentPanel.listItems}/>
      </div>
    )
  }
}

function TagPanel(props) {
  let list = props.listItems.items.map((tag) => <Tag onClick={props.onClick} key={tag} tag={tag} id="panel1" />)
  return (<div id="panel1">{props.type} {list}</div>)
}

function CardPanel(props) {
  let cards
  console.log(props.listItems.items);
  if (props.listItems.items.length === 0) {
    cards = (<h1>Nothing to see here</h1>)
  } else {
    cards = props.listItems.items.map(card => {
      return (
        <Card answered={card.answered} key={card.id} id={card.id} timeCreated={card.timeCreated} question={card.question} body={card.body} />
      )
    })
  }
  return (<div id="panel1">{props.type} {cards}</div>)
}
function CommentPanel(props) {
  return (<div id={props.id}>{props.type} {props.listItems.items.toString()}</div>)
}


let exports = {Title, PanelGroup}
export default exports
