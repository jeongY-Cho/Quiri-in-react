import { EventEmitter } from "events"
import Dispatcher from "../dispatcher"


class DataHandler extends EventEmitter {
  constructor() {
    super()


    this.tagItems = []
    this.cardPanel = {
      title: "Cards",
      subTitle: "Click a Tag below to view cards with that tag.",
      itmes: []
    }
    this.activeTagId = ''
    this.activeCardId = ''
    this.commentPanel = {
      question: "Comments",
      body: "Click a Tag below to view cards with that tag.",
      listItems: {
        items: []
      },
      closePanel: this.closeCommentPanel,
      onMouseEnter: this.focusCommentPanel
    }

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
    return this.cardPanel
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

  gotCardsFromDb(tag, array) {
    this.cardPanel.title = tag
    this.cardPanel.items = array
    this.activeTagId = tag
    this.emit("change")
  }

  getCommentsFrom
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
      default: { }
    }
  }
}

const dataStore = new DataHandler();
Dispatcher.register(dataStore.handleActions.bind(dataStore))
window.Dispatcher = Dispatcher
export default dataStore