import React, { Component } from "react"
import TagPanel from "./panels/tagPanel.js"
import CardPanel from "./panels/cardPanel.jsx"
import CommentPanel from "./panels/commentPanel.js"
import { db } from "./firestore.js"



class PanelGroup extends Component {
  constructor(props) {
    super(props)

    // bind functions
    this.getCardsByTag = this.getCardsByTag.bind(this)
    this.getCommentsByCard = this.getCommentsByCard.bind(this)
    this.closeCommentPanel = this.closeCommentPanel.bind(this)

    let tagPanel = {
      type: "tags",
      title: "Tags",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick: this.getCardsByTag,
    }
    let cardPanel = {
      type: "cards",
      title: "Cards",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick: this.getCommentsByCard,
    }
    let commentPanel = {
      type: "comments",
      question: "Comments",
      body: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      closePanel: this.closeCommentPanel
    }


    this.state = {
      tagPanel: tagPanel,
      cardPanel: cardPanel,
      commentPanel: commentPanel,
      tagId: '',
      cardId: '',
      tagState: "extended",
      cardState: "closed",
      commentState: "closed"
    }
  }

  async getCardsByTag(e) {
    let tagId = e.currentTarget.id
    if (tagId === this.state.tagId) { return }

    this.setState({
      cardState: "closed",
      commentState: "closed",
      tagId
    })
    let cardsRef = await db.collection("active")
    let cards = await cardsRef.where("tags", "array-contains", tagId).orderBy("timeCreated").get()
    cards = cards.docs.map(card => {
      let data = card.data()

      let question = data.question
      let body = data.body
      if (body.length === 100) {
        body = body.substring(0, 100) + "..."
      }
      let answered = data.answered
      let timeCreated = data.timeCreated

      return {
        id: card.id,
        question,
        body,
        answered,
        timeCreated
      }
    })

    let cardPanel = Object.assign({}, this.state.cardPanel)

    cardPanel.listItems.items = cards

    this.setState({
      cardPanel: cardPanel,
      tagId: tag,
      tagState: "open",
      cardState: "extended",
      commentState: "closed",
    })
  }

  async getCommentsByCard(e) {
    let cardId = e.currentTarget.id
    console.log(cardId);
    let cardRef = await db
      .collection("Active")
      .doc(this.state.tagId)
      .collection("cards")
      .doc(cardId)

    let docSnapshot = await cardRef.get()
    let data = docSnapshot.data()
    let comments = await cardRef.collection("comments").get()

    comments = await comments.docs.map(comment => {
      let data = comment.data()
      let body = data.body
      let timeCreated = data.timeCreated
      let commentId = comment.id
      return {
        body,
        timeCreated,
        id: commentId
      }
    })

    let commentPanel = Object.assign({}, this.state.commentPanel)
    commentPanel.listItems.items = comments
    commentPanel.body = data.body
    commentPanel.question = data.question
    console.log(commentPanel);
    this.setState({
      cardId,
      commentPanel,
      tagState: "shrunk",
      cardState: "open",
      commentState: "extended"
    })
  }

  async componentDidMount() {

    let tags = await db.collection("Active").get()
    tags = tags.docs.map(tag => {
      return {
        tag: tag.id,
        id: tag.id
      }
    })
    console.log(tags);

    let panel = Object.assign({}, this.state.tagPanel)

    panel.listItems.items = tags
    this.setState({
      tagPanel: panel
    })
  }

  closeCommentPanel(e) {
    console.log("click");
    this.setState({
      cardState: "extended",
      tagState: "open",
      commentState: "closed"

    })
  }
  render() {

    return (
      <div className="container-fluid">
        <div className="row">
          <TagPanel
            className="transitory bg-light"
            type={this.state.tagPanel.type}
            state={this.state.tagState}
            onClick={this.state.tagPanel.onClick}
            id="tagPanel"
            listItems={this.state.tagPanel.listItems}
          />
          <CardPanel
            className="transitory"
            type={this.state.cardPanel.type}
            state={this.state.cardState}
            onClick={this.state.cardPanel.onClick}
            id="cardPanel"
            listItems={this.state.cardPanel.listItems}
          />
          <CommentPanel
            className="transitory"
            type={this.state.commentPanel.type}
            state={this.state.commentState}
            onClick={this.state.commentPanel.onClick}
            closePanel={this.closeCommentPanel}
            id="commentPanel"
            listItems={this.state.commentPanel.listItems}
            cardId={this.state.cardId}
            question={this.state.commentPanel.question}
            body={this.state.commentPanel.body}
          />

        </div>
      </div>
    )
  }
}


export default PanelGroup
