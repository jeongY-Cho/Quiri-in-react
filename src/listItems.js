import React, { Component } from "react"

class Tag extends Component {
  render () {

    let tagStyle = {
      "fontSize":"30px",
      cursor:"pointer",
    }
    return (
      <div style={tagStyle} onClick={this.props.onClick} id={this.props.tag}><h1 className="title card pl-2 pb-2">&#9776; {this.props.tag}</h1></div>
      // <div><button onClick={this.props.onClick}><h1 className="title" id={this.props.tag}>&#9776; {this.props.tag}</h1></button></div>
    )
  }
}

class Card extends Component {
  render () {

    let cardStyle = {
      cursor:"pointer",
    }

    let answered = this.props.answered ? <span className="badge badge-primary">Answered</span> : null
    return (
        <div style={cardStyle} className="card mb-1" onClick={this.props.onClick} id={this.props.id}>
          <div className="card-body">
            <h5 className="card-title">{this.props.question} {answered}</h5>
            <h6 className="card-text">{this.props.body}</h6>
            <p className="card-subtitle text-muted">Created: {this.props.timeCreated.toDate().toString()}</p>
          </div>
        </div>
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
