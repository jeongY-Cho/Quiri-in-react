import Dispatcher from "../dispatcher"
import { db, Timestamp } from "../firestore"

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

export async function newComment(cardId, comment) {

  if (comment === '') { return }

  const data = {
    comment,
    timeCreated: Timestamp()
  };


  let ref = await db.collection("active").doc(cardId).collection("comments").add(data)

  data.id = ref.id

  Dispatcher.dispatch({
    type: "NEW_COMMENT",
    item: data
  })
}

export function setState(target, state) {
  Dispatcher.dispatch({
    type: "SET_STATE",
    target,
    state
  })
}

export function closeComments() {
  Dispatcher.dispatch({
    type: "CLOSE_COMMENTS"
  })
}

export async function setActiveCardData(cardId) {
  let commentSnap = await db.collection("active").doc(cardId).get()
  let commentData = commentSnap.data()

  commentData.id = commentSnap.id

  Dispatcher.dispatch({
    type: "SET_CARD_DATA",
    data: commentData
  })

}

export async function getCommentsByCard(cardId) {

  // get querySnaphot of comments
  let comments = await db.collection("active").doc(cardId).collection("comments").get()

  // map querySnapshot into an array of items
  comments = comments.docs.map((comment) => {
    let data = comment.data()

    return {
      id: comment.id,
      comment: data.comment,
      timeCreated: data.timeCreated
    }
  })

  // Dispatch to dispatcher
  Dispatcher.dispatch({
    type: "GET_COMMENTS",
    items: comments,
    cardId
  })

  setState("tagPanel", "shrunk")
  setState("cardPanel", "open")
  setState("commentPanel", "extended")
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