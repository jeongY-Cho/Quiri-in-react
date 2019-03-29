import React, { Component } from 'react'
import { Comment } from '../listItems.js'

function CommentPanel(props) {
  return (<span id={props.id}>{props.type} {props.listItems.items.toString()}</span>)
}

export default CommentPanel
