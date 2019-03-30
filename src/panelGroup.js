import React, {Component} from "react"
import TagPanel from "./panels/tagPanel.js"
import CardPanel from "./panels/cardPanel.jsx"
import CommentPanel from "./panels/commentPanel.js"
import db from "./firestore.js"



class PanelGroup extends Component {
  constructor(props) {
    super(props)

    this.increment = this.increment.bind(this)
    this.getCardsByTag = this.getCardsByTag.bind(this)
    this.getCommentsByCard = this.getCommentsByCard.bind(this)
    this.closeCommentPanel = this.closeCommentPanel.bind(this)

    let tagPanel = {
      type: "tags",
      title: "Tags",
      state: "extended",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick:this.getCardsByTag,
    }
    let cardPanel = {
      type: "cards",
      title: "Cards",
      state: "extended",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick:this.getCommentsByCard,
    }
    let commentPanel = {
      type: "comments",
      title: "Comments",
      state: "extended",
      subTitle: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      onClick: this.increment,
      inc: 0
      closePanel: this.closeCommentPanel
    }


    this.state = {
      tagPanel: tagPanel,
      cardPanel: cardPanel,
      commentPanel: commentPanel
    }
  }


  async getCardsByTag(e) {
    let tag = e.target.id
    let cards = await db.collection("Active").doc(tag).collection("cards").get()
    cards = cards.docs

    cards = cards.map(card => {
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

    console.log(cards);
    let cardPanel = Object.assign({}, this.state.cardPanel)

    cardPanel.listItems.items = cards

    this.setState({
      cardPanel:cardPanel
    })
  }

  async getCommentsByCard(e) {
    let cardId = e.currentTarget.id
    console.log(cardId);
    let comments = await db
      .collection("Active")
      .doc(this.state.tagId)
      .collection("cards")
      .doc(cardId)
      .collection("comments")
      .get()
    comments = await comments.docs.map(comment => {
      let data = comment.data()
      console.log(data);
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
    console.log(commentPanel);
    this.setState({
      cardId,
      commentPanel,
      tagState: "open",
      cardState: "open",
      commentState: "extended"
    })
  }
  async componentDidMount() {

    let tags = await db.collection("Active").get()
    tags = tags.docs.map(tag => {
      return {
        tag:tag.id,
        id:tag.id
      }
    })
    console.log(tags);

    let panel = Object.assign({}, this.state.tagPanel)

    panel.listItems.items = tags
    this.setState({
      tagPanel:panel
    })
  }

  closeCommentPanel(e) {
    console.log("click");
    this.setState({
      commentState: "closed",
      cardState: "extended"
    })
  }
  render() {

    return (
      <div className="container">
        <TagPanel type={this.state.tagPanel.type} state={this.state.tagPanel.state} onClick={this.state.tagPanel.onClick} id="tagPanel" listItems={this.state.tagPanel.listItems}/>
        <CardPanel type={this.state.cardPanel.type} state={this.state.cardPanel.state} onClick={this.state.cardPanel.onClick} id="cardPanel" listItems={this.state.cardPanel.listItems}/>
        <CommentPanel type={this.state.commentPanel.type} state={this.state.commentPanel.state} onClick={this.state.commentPanel.onClick} id="commentPanel" listItems={this.state.commentPanel.listItems}/>
      </div>
    )
  }
}


export default PanelGroup
