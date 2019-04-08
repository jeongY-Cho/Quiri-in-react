import React, { Component } from "react"
import TagPanel from "./panels/tagPanel.js"
import CardPanel from "./panels/cardPanel.jsx"
import CommentPanel from "./panels/commentPanel.js"
import { db } from "./firestore.js"
import DataStore from "./stores/dataStore.js"



class PanelGroup extends Component {
  constructor(props) {
    super(props)

    // bind functions
    this.closeCommentPanel = this.closeCommentPanel.bind(this)
    this.focusTagPanel = this.focusTagPanel.bind(this)
    this.focusCardPanel = this.focusCardPanel.bind(this)
    this.focusCommentPanel = this.focusCommentPanel.bind(this)


    this.state = {
      tagState: DataStore.getTagPanelState(),
      cardState: DataStore.getCardPanelState(),
      commentState: DataStore.getCommentPanelState()
    }
  }


  focusTagPanel() {
    if (this.state.tagId === '') {
      return
    } else if (this.state.cardId === '') {
      this.setState({
        tagState: "extended",
        cardState: "open"
      })
    } else {
      this.setState({
        tagState: "extended",
        cardState: "open",
        commentState: "open"
      })
    }
  }

  focusCardPanel() {
    if (this.state.cardId === '') {
      this.setState({
        tagState: "open",
        cardState: "extended"
      })
    } else {
      this.setState({
        tagState: "open",
        cardState: "extended",
        commentState: "open"
      })
    }
  }

  focusCommentPanel() {

    this.setState({
      tagState: "shrunk",
      cardState: "open",
      commentState: "extended"
    })

  }

  closeCommentPanel(e) {
    this.setState({
      cardState: "extended",
      tagState: "open",
      commentState: "closed",
      cardId: ''
    })
  }

  render() {

    return (
      <div className="container-fluid">
        <div className="row">
          <TagPanel
            className="transitory bg-light"
            state={this.state.tagState}
            id="tagPanel"
          />
          <CardPanel
            className="transitory bg-light"
            state={this.state.cardState}
            id="cardPanel"
          />
          <CommentPanel
            className="transitory bg-light"
            state={this.state.commentState}
            id="commentPanel"
          />
        </div>
      </div>
    )
  }
}


export default PanelGroup
