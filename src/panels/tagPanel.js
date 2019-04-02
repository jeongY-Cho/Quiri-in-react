import React, { Component } from 'react';
import { Tag } from "../listItems.js"

class TagPanel extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      query: "",
      items: [],
      internal: false,
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (state.internal === true) {  //  ignore if internal update to state
      return { internal: false }
    }
    // set props as state if its not an internal update
    return {
      items: props.listItems.items,  //  set any updates
      query: '',                     //  reset query
      internal: false                // set interal update to false just in case
    }
  }

  searchTags(query) {
    let result = this.props.listItems.items
      .slice()
      .filter(function (item) {
        let values = Object.values(item)

        for (let value of values) {
          if (String(value).toLowerCase().includes(query.toLowerCase())) {
            return true
          }
        }
        return false
      })
    return result
  }

  handleChange(e) {
    let query = e.target.value.trim()
    let items = this.searchTags(query)

    this.setState({
      query: e.target.value,
      items: items,
      internal: true
    })
  }

  render() {

    let title = "Tags"
    let subTitle = "Click a tag to see cards"

    let list = this.state.items.map((tag) => {
      let active = false
      if (tag.id === this.props.activeTag) {
        active = true
      }

      return <Tag onClick={this.props.onClick} key={tag.id} tag={tag.tag} id={tag.id} active={active} />
    })

    let divStyle = { width: 0 }
    let listStyle = { fontSize: "30px" }
    switch (this.props.state) {
      case "extended":
        divStyle.width = "50%"
        break
      case "open":
        divStyle.width = "25%"
        break
      case "shrunk":
        divStyle.width = "20%"
        listStyle.fontSize = "18px"
        break
      default:
        divStyle.width = "25%"
    }


    return (
      <div id={this.props.type + "Panel"} className={this.props.className} style={divStyle} onWheel={this.props.onScroll}>
        <div className="p-2">
          <h1>{title}</h1>
          <p>{subTitle}<br />{this.state.state}</p>
          <div className="justify-content-center mb-2">
            <input type="text" className="form-control" placeholder="Search" id="searchTags" value={this.state.query} onChange={this.handleChange} />
          </div>
          <ul id={this.props.type + "List"} style={listStyle} className="list-group">
            {list}
          </ul>
        </div>
      </div>
    )
  }
}

export default TagPanel
