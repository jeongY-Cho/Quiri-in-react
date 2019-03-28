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
  render () {
    let text;
    if (this.state.isName) {
      text = this.props.name
    } else {
      text = "Hello"
    }
    return (
      <div>
        <h1>{text}</h1>
      </div>
    )
  }
}

export default Title
