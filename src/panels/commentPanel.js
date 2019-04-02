import React, { Component } from 'react'
import { Comment } from '../listItems.js'
import { Timestamp, db } from "../firestore.js"


class CommentPanel extends Component {
  constructor(props) {
    super(props)

    // bind methods
    this.newComment = this.newComment.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      query: "",
      items: [],
      internal: false,
      comment: "",
      additions: [],
      posting: false
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (state.internal === true) {  //  ignore if internal update to state
      return { internal: false }
    }
    // set props as state if its not an internal update
    return {
      items: props.listItems.items,  //  set any updates
      query: '',                     //  reset query
      internal: false,                // set interal update to false just in case
    }
  }

  async newComment(e) {

    if (this.state.comment === '') { return }
    let additions = this.state.additions.slice()
    const data = {
      comment: this.state.comment,
      timeCreated: Timestamp()
    };
    additions.push(data)

    this.setState({
      posting: true,
      internal: true
    })


    db.collection("active").doc(this.props.cardId).collection("comments").add(data)

    this.setState({
      comment: "",
      additions,
      internal: true,
      posting: false
    })
  }

  handleChange(e) {
    this.setState({ comment: e.target.value, internal: true })
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.state === "open" || prevProps.state === "extended") && this.props.state === "closed") {
      this.setState({
        additions: []
      })
    }
  }
  render() {
    let colorLight = true
    let list = this.state.items.map((comment) => {
      colorLight = !colorLight

      return (<Comment
        colorLight={colorLight}
        key={comment.id}
        comment={comment.body}
        timeCreated={comment.timeCreated}
        id={comment.id}
      />
      )

    })

    let divStyle = {}
    switch (this.props.state) {
      case "extended":
        divStyle.width = "55%"
        break
      case "open":
        divStyle.width = "25%"
        break
      default:
        divStyle.width = "0%"
    }


    let additions = this.state.additions.map((comment) => {
      colorLight = !colorLight
      return (<Comment
        posting={this.state.posting}
        colorLight={colorLight}
        key={comment.id}
        comment={comment.comment}
        timeCreated={comment.timeCreated}
        id={comment.id}
      />
      )

    })

    return (
      <div id={this.props.type + "Panel"} className={this.props.className} style={divStyle} onMouseEnter={this.props.onMouseEnter}>
        <div className="p-2">
          <h1 className="heading">{this.props.question}</h1>
          <p>{this.props.body}<br />{this.state.state}</p>
          <button className="btn btn-primary" onClick={this.props.closePanel}>&times;</button>
          <ul id={this.props.type + "List"} className="list-group mb-2">
            {list}
            {additions}
          </ul>
          <div className="form">
            <textarea className="form-control mb-2" placeholder="Comment here:" rows="5" onChange={this.handleChange} value={this.state.comment} />
            <button className="btn btn-secondary btn-block" value="something" onClick={this.newComment}>Submit Comment</button>
          </div>
        </div>
      </div>
    )
  }
}


export default CommentPanel
