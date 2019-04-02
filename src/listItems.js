import React, { Component } from "react"
import BarLoader from '@bit/davidhu2000.react-spinners.bar-loader'


class Tag extends Component {

  m(classList) {
    return classList.join(" ")
  }
  render() {

    let tagStyle = {
      cursor: "pointer",
      fontSize: "inherit",
      transition: "all 0.5s linear",
      overflowX: "auto",
      whiteSpace: "nowrap",
    }
    let h1Style = {
      fontSize: "inherit"
    }
    let divClass = ["tab", "list-group-item"]
    if (this.props.active) {
      divClass.push("bg-primary")
      divClass.push("text-light")
    }

    return (
      <div className={this.m(divClass)} style={tagStyle} onClick={this.props.onClick} id={this.props.tag}><h1 style={h1Style} className="title">&#9776; {this.props.tag}&nbsp;</h1></div>
      // <div style={tagStyle} onClick={this.props.onClick} id={this.props.tag} className="title card pl-2 pb-2">&#9776; {this.props.tag}</div>

      // <div><button onClick={this.props.onClick}><h1 className="title" id={this.props.tag}>&#9776; {this.props.tag}</h1></button></div>
    )
  }
}

class Card extends Component {
  render() {
    function m(classList) {
      return classList.join(" ")
    }
    let cardStyle = {
      cursor: "pointer",
      transition: "all 0.5s"
    }
    let divClass = ["card", "mb-1"]
    let dateColor = "text-muted";
    if (this.props.active) {
      divClass.push("bg-info")
      divClass.push("text-light")
      dateColor = "text-light "
    }

    let color;
    let answered = this.props.answered ? <span className="badge badge-primary">Answered</span> : null
    return (
      <div style={cardStyle} className={m(divClass)} onClick={this.props.onClick} id={this.props.id}>
        <div className="card-body">
          <h5 className={"card-title " + color}>{this.props.question} {answered}</h5>
          <h6 className={"card-text " + color}>{this.props.body}</h6>
          <p className={"card-subtitle " + dateColor}>Created: {this.props.timeCreated.toDate().toString()}</p>
        </div>
      </div>
    )
  }
}


class Comment extends Component {
  render() {

    let timeStamp
    if (this.props.timeCreated) {
      timeStamp = this.props.timeCreated.toDate().toString()
    } else {
      timeStamp = null
    }

    let className = ["p-2", "list-group-item"]
    if (this.props.colorLight) {
      className.push("bg-light")
    }

    if (this.props.posting) {
      return (
        <div className={className.join(" ")}>
          <BarLoader />
        </div>
      )
    }
    return (
      <div className={className.join(" ")}>
        <h5 className="comment">{this.props.comment}</h5>
        <p className="time">Time: {timeStamp}</p>
      </div>
    )
  }
}

export { Tag, Card, Comment }
