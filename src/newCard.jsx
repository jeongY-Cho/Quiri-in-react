import React, { Component } from "react";

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
      height: "50vh",
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
    this.state = {
      tags: "",
      question: "",
      body: ""
    }
  }

  handleChange(e) {
    let value = e.target.value

    this.setState({
      [e.target.id]: value
    })
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
                <h1 className="text-light">Post a Card</h1>
              </div>
            </div>
            <div className="m-2">
              <div class="form-group row">
                <label for="title" className="col-auto col-sm-3 col-md-2 col-form-label text-light">Question</label>
                <div className="col">
                  <input class="form-control" type="text" name="Title" value={this.state.question} onChange={this.handleChange} id="question">
                  </input>
                </div>
              </div>
              <div class="form-group row">
                <label for="tags" className="col-auto col-sm-3 col-md-2 form-label text-light">Tags</label>
                <div className="col">
                  <input class="form-control" type="text" name="tags" value={this.state.tags} onChange={this.handleChange} id="tags">
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
                  <textarea name="message" class="form-control" id="message" rows="3" onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <button className="btn btn-warning btn-block" onClick={this.props.closeForm}>Clear and Close</button>
                </div>
                <div className="col">
                  <button className="btn btn-primary btn-block">Submit</button>
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