import React, { Component } from "react"

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

export {Tag, Card, Comment}
