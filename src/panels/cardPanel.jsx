import React, { Component } from 'react'
import { Card } from '../listItems.js'

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

export default CardPanel
