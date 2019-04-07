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
    this.getCommentsByCard = this.getCommentsByCard.bind(this)
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


  async getCommentsByCard(e) {
    let cardId = e.currentTarget.id

    if (cardId === this.state.cardId) { return }
    this.setState({
      commentState: "closed",
      cardId
    })
    let cardRef = await db
      .collection("active")
      .doc(cardId)

    console.log(cardId);

    let docSnapshot = await cardRef.get()

    let data = docSnapshot.data()


    let commentsSnapshot = await cardRef.collection("comments").orderBy("timeCreated").get()
    console.log(commentsSnapshot);
    console.log(commentsSnapshot.exists);

    let commentsList = []
    commentsList = commentsSnapshot.docs

    commentsList = commentsList.map(comment => {
      let data = comment.data()
      console.log(data);

      let body = data.comment
      let timeCreated = data.timeCreated
      let commentId = comment.id
      return {
        body,
        timeCreated,
        id: commentId
      }
    })

    let commentPanel = Object.assign({}, this.state.commentPanel)
    commentPanel.listItems.items = commentsList
    commentPanel.body = data.body
    commentPanel.question = data.question
    setTimeout(() => {
      this.setState({
        cardId,
        commentPanel,
        tagState: "shrunk",
        cardState: "open",
        commentState: "extended"
      })
    }, 300)
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
    console.log("over");

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
            onScroll={this.focusTagPanel}
            id="tagPanel"
          />
          <CardPanel
            className="transitory bg-light"
            state={this.state.cardState}
            onScroll={this.focusCardPanel}
            id="cardPanel"
          />
        </div>
      </div>
    )
  }
}


export default PanelGroup
