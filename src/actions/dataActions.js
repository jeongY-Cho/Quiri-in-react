import Dispatcher from "../dispatcher"
import { db } from "../firestore"

export async function initTags() {

  let tags = await db.collection("tags").get()
  tags = tags.docs.map((tag) => {
    return {
      tag: tag.id,
      id: tag.id
    }
  })

  Dispatcher.dispatch({
    type: "GET_TAGS",
    items: tags
  })
}

export function setState(target, state) {
  Dispatcher.dispatch({
    type: "SET_STATE",
    target,
    state
  })
}

export async function getCardsByTag(tagId) {

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

  Dispatcher.dispatch({ type: "GET_CARDS", items: cards, tag: tagId })
  setState("cardPanel", "extended")
  setState("tagPanel", "open")
}