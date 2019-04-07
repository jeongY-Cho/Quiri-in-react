import React, { Component } from 'react';
import { Tag } from "../listItems.js"
import DataStore from "../stores/dataStore.js"
import * as DataActions from "../actions/dataActions"

class TagPanel extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)


    this.state = {
      query: "",
      items: [],
      activeTag: DataStore.getActiveTagId()
    }

    console.log(this.state);

  }


  searchTags(query) {
    let result = DataStore.getTags()
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

  componentWillMount() {

    DataActions.initTags()

    DataStore.on("change", () => {
      this.setState({
        items: DataStore.getTags(),
        activeTag: DataStore.getActiveTagId()
      })
    })
  }

  handleChange(e) {
    let query = e.target.value.trim()
    let items = this.searchTags(query)

    this.setState({
      query: e.target.value,
      items: items,
    })
  }

  render() {

    let title = "Tags"
    let subTitle = "Click a tag to see cards"

    let list = this.state.items.map((tag) => {
      let active = false
      if (tag.id === this.state.activeTag) {
        active = true
      }

      return <Tag onClick={DataActions.getCardsByTag} key={tag.id} tag={tag.tag} id={tag.id} active={active} />
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
          <p>{subTitle}</p>
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
