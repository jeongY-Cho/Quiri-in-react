import React, { Component } from "react"

class Title extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isName: false
    }
  }

  tick() {
    this.setState(state => ({
      isName: !state.isName
    }))
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    let text;
    if (this.state.isName) {
      text = this.props.name
    } else {
      text = "Hello"
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">
            <h1>{text}</h1>
          </div>
          <button onClick={this.props.showForm}>showForm</button>
        </div>
      </div>
    )
  }
}

export default Title
