import React, {Component} from 'react';
import {Tag, Card, Comment} from "./listItems.js"

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


export {Title, TagPanel, CardPanel, CommentPanel}
