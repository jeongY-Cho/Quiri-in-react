import React, { Component } from 'react'
import { Comment } from '../listItems.js'

function CommentPanel(props) {
  return (<div id={props.id}>{props.type} {props.listItems.items.toString()}</div>)
}

export default CommentPanel
