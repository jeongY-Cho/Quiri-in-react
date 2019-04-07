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
    return this.commentPanel
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
    console.log("gotCardsFromDb");

    this.emit("change")
  }

  gotCommentsFromDb(cardId, comments) {

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
      case "SET_STATE": {
        this.setState(action.target, action.state)
        console.log("SET_STATE");

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