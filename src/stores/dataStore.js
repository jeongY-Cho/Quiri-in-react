import { EventEmitter } from "events"
import Dispatcher from "../dispatcher"


class DataHandler extends EventEmitter {
  constructor() {
    super()


    this.tagItems = []
    this.cardItems = []
    this.commentItems = []

    this.activeTagId = ''
    this.activeCardId = ''

    this.activeCardData = {
      question: '',
      body: '',
      timeCreated: '',
      answer: '',
      timeAnswered: '',
    }

    this.tagPanelState = "extended"
    this.cardPanelState = "closed"
    this.commentPanelState = "closed"
  }

  getTagPanelState() {
    return this.tagPanelState
  }
  getCardPanelState() {
    return this.cardPanelState
  }
  getCommentPanelState() {
    return this.commentPanelState
  }
  getActiveTagId() {
    return this.activeTagId
  }

  getActiveCardId() {
    return this.activeCardId
  }

  getAll() {
    return [this.tagPanel, this.cardPanel, this.commentPanel]
  }

  getTags() {
    return this.tagItems
  }

  gotTagsFromDb(items) {
    this.tagItems = items
    this.emit("change")
  }

  getCards() {
    return this.cardItems
  }

  getComments() {
    return this.commentItems
  }

  getActiveCardData() {
    return this.activeCardData
  }
  newTag(input) {
    this.tagItems.push({
      id: input.id,
      tag: input.tag
    })

    this.emit("change")
  }

  newTags(tags) {
    this.tagItems = this.tagItems.concat(tags)
  }

  gotCardsFromDb(tag, cards) {
    this.cardItems = cards
    this.activeTagId = tag

    this.emit("change")
  }

  gotCommentsFromDb(cardId, comments) {
    this.commentItems = comments
    this.activeCardId = cardId

    this.emit("change")
  }

  newComment(data) {
    this.commentItems.push(data)

    this.emit("change")
  }

  setState(target, state) {

    switch (target) {
      case "tagPanel": {
        this.tagPanelState = state
        break
      }
      case "cardPanel": {
        this.cardPanelState = state
        break
      }
      case "commentPanel": {
        this.commentPanelState = state
        break
      }
      default: { }
    }

    this.emit("change")
  }

  closeComments() {
    this.activeCardData = {};
    this.activeCardId = '';
    this.commentItems = []

    this.setState("tagPanel", "open");
    this.setState("cardPanel", "extended");
    this.setState("commentPanel", "closed");

    this.emit("change");
  }

  handleActions(action) {

    switch (action.type) {
      case "GET_TAGS": {
        this.gotTagsFromDb(action.items)
        break
      }

      case "GET_CARDS": {
        this.gotCardsFromDb(action.tag, action.items)
        break
      }

      case "GET_COMMENTS": {
        this.gotCommentsFromDb(action.cardId, action.items)
        break
      }

      case "SET_STATE": {
        this.setState(action.target, action.state)
        break
      }

      case "NEW_COMMENT": {
        this.newComment(action.item)
        break
      }

      case "SET_CARD_DATA": {
        this.activeCardData = action.data

        this.emit("change")
        break
      }

      case "CLOSE_COMMENTS": {
        this.closeComments();
        break
      }
      default: { }
    }
  }

}

const dataStore = new DataHandler();
Dispatcher.register(dataStore.handleActions.bind(dataStore))
window.Dispatcher = Dispatcher
export default dataStore