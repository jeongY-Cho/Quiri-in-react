import React, { Component } from 'react'
import { Comment } from '../listItems.js'
import { Timestamp, db } from "../firestore.js"
import * as DataActions from "../actions/dataActions";
import DataStore from '../stores/dataStore.js';


class CommentPanel extends Component {
  constructor(props) {
    super(props)

    // bind methods
    this.newComment = this.newComment.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)

    this.state = {
      query: "",
      items: DataStore.getComments(),
      posting: false,
      state: DataStore.getCommentPanelState(),
      cardData: DataStore.getActiveCardData(),
      comment: ''
    }
  }

  async newComment(e) {
    DataActions.newComment(this.state.cardData.id, this.state.comment)
    this.setState({
      comment: ''
    })
  }

  handleChange(e) {
    this.setState({ comment: e.target.value, internal: true })
  }

  componentDidMount() {
    DataStore.on("change", () => {
      this.setState({
        items: DataStore.getComments(),
        state: DataStore.getCommentPanelState(),
        cardData: DataStore.getActiveCardData()
      })
    })

  }

  onMouseEnter() {
    if (this.state.state === "extended") return
    DataActions.setState("tagPanel", "shrunk")
    DataActions.setState("cardPanel", "open")
    DataActions.setState("commentPanel", "extended")
  }

  closePanel(e) {
    DataActions.closeComments()
  }
  render() {


    let colorLight = true
    let list = this.state.items.map((comment) => {
      colorLight = !colorLight

      return (<Comment
        colorLight={colorLight}
        key={comment.id}
        comment={comment.comment}
        timeCreated={comment.timeCreated}
        id={comment.id}
      />
      )

    })

    let divStyle = {}
    switch (this.state.state) {
      case "extended":
        divStyle.width = "55%"
        break
      case "open":
        divStyle.width = "25%"
        break
      default:
        divStyle.width = "0%"
    }


    return (
      <div id={this.props.type + "Panel"} className={this.props.className} style={divStyle} onMouseEnter={this.onMouseEnter}>
        <div className="p-2">
          <div className="row">
            <div className="col">
              <h1 className="heading">{this.state.cardData.question}</h1>
              <p>{this.state.cardData.body}</p>
            </div>
            <div className="col-auto">
              <span style={{ fontSize: "40px", cursor: "pointer" }} className="text-secondary" onClick={this.closePanel}>X</span>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <ul id={this.props.type + "List"} className="list-group mb-2">
                {list}
              </ul>
            </div>
          </div>
          <div className="form-row">
            <div className="col">
              <textarea className="form-control mb-2" placeholder="Comment here:" rows="5" onChange={this.handleChange} value={this.state.comment} />
            </div>
          </div>
          <div className="form-row">
            <div className="col">
              <button className="btn btn-secondary btn-block" value="something" onClick={this.newComment}>Submit Comment</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default CommentPanel
