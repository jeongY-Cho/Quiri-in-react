import React, { Component } from "react";
import { db, Timestamp } from "./firestore.js";

class HoverForm extends Component {
  style = {
    background: {
      position: "fixed",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#000000",
      opacity: "0.7",
      zIndex: "10",
      transition: "all 0.5s linear"
    },
    form: {
      position: "absolute",
      width: "50vw",
      top: "25vh",
      left: "25vw",
      zIndex: "11",
      transition: "all 0.5s linear",
      borderRadius: "2vh",
      overflowY: "auto",
    }
  }

  class = {
    background: [],
    form: [
      "bg-dark",
    ]
  }

  j(classList) {
    return classList.join(" ")
  }

  constructor(props) {
    super(props)

    // bind methods
    this.handleChange = this.handleChange.bind(this)
    this.submitCard = this.submitCard.bind(this)

    this.state = {
      tags: "",
      question: "",
      body: ""
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  async submitCard() {
    function separateTags(tagString) {
      let tagList = tagString.split(" ")
      return tagList.filter((item) => item.length >= 3)
    }

    let tags = separateTags(this.state.tags)

    if (tags.length === 0) {
      throw new Error("no valid tags")
    }

    await db.collection("active").add({
      tags: tags,
      question: this.state.question,
      body: this.state.body,
      timeCreated: Timestamp(),
      answered: false
    })

    for (let tag of tags) {
      let tagRef = await db.collection("tags").doc(tag)
      let tagSnap = await tagRef.get()
      let tagExists = tagSnap.exists

      if (!tagExists) {
        await db.collection("tags").doc(tag).set({
          timeCreated: Timestamp(),
          count: 1,
          unanswered: 1,
          answered: 0
        })
      } else {
        let tagData = await tagSnap.data()

        await db.collection("tags").doc(tag).update({
          count: tagData.count + 1,
          unanswered: tagData.unanswered + 1
        })
      }
    }

    this.props.closeForm({ target: "close" })
  }

  render() {
    return (
      // background
      <div>
        {/* background */}
        <div style={this.style.background} onClick={this.props.closeForm} />
        {/* form */}
        <div style={this.style.form} className="bg-dark">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <h1 className="text-light text-center">Post a Card</h1>
              </div>
            </div>
            <div className="m-2">
              <div className="form-group row">
                <label for="title" className="col-sm-12 col-md-auto col-form-label text-light">Question:</label>
                <div className="col">
                  <input className="form-control" type="text" name="Title" value={this.state.question} onChange={this.handleChange} id="question">
                  </input>
                </div>
              </div>
              <div className="form-group row">
                <label for="tags" className="col-sm-12 col-md-auto form-label text-light">Tags:</label>
                <div className="col">
                  <input className="form-control" type="text" name="tags" value={this.state.tags} onChange={this.handleChange} id="tags">
                  </input>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label for="message" className="text-light">Body</label>
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <textarea name="message" className="form-control" id="body" rows="3" onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row mb-3">
                <div className="col">
                  <button className="btn btn-warning btn-block" id="close" onClick={this.props.closeForm}>Clear and Close</button>
                </div>
                <div className="col">
                  <button className="btn btn-primary btn-block" id="submit" onClick={this.submitCard}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HoverForm