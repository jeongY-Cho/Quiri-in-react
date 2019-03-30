import React, { Component } from 'react'
import { Comment } from '../listItems.js'


class CommentPanel extends Component {
  constructor(props) {
    super(props)

    // define this.additions so it doesnt break
    this.additions = []
    // bind methods
    this.newComment = this.newComment.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      query: "",
      items: [] ,
      internal: false,
      comment: ""
    }
  }
  static getDerivedStateFromProps(props, state) {
    if ( state.internal === true ) {  //  ignore if internal update to state
      return {internal:false}
    }
    // set props as state if its not an internal update
    return {
      items: props.listItems.items,  //  set any updates
      query: '',                     //  reset query
      internal: false,                // set interal update to false just in case
    }
  }

  newComment(e) {
    console.log(e);
    e.preventDefault()


    this.additions.push({
      id: new Date(),
      body: this.state.comment

    })

    this.setState({
      comment: ""
    })
  }

  handleChange(e) {
    this.setState({comment: e.target.value})
  }

  render() {

    let title = "Tags"
    let subTitle = "Click a tag to see cards"

    let colorLight = true
    let list = this.state.items.map((comment) => {
      colorLight = !colorLight

      return <Comment colorLight={colorLight} key={comment.id} comment={comment.body} timeCreated={comment.timeCreated} id={comment.id} />

    })

    let divStyle = {width:0}
    switch (this.props.state) {
      case "extended":
        divStyle.width = "50%"
        break
      case "open":
        divStyle.width = "25%"
        break
      default:
        divStyle.width = "0%"
    }

    let additions = this.additions.map((comment) => {
      colorLight = !colorLight

      return <Comment colorLight={colorLight} key={comment.id} comment={comment.body} timeCreated={comment.timeCreated} id={comment.id} />

    })

    // <div id="panel1">{this.props.type} {list}</div>)
    return (
      <div id={this.props.type + "Panel"} className={this.props.className} style={divStyle}>
        <div className="p-2">
          <h1 className="heading">{title}</h1>
          <p>{subTitle}<br />{this.state.state}</p>
          <button className="btn btn-primary" onClick={this.props.closePanel}>X</button>
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
