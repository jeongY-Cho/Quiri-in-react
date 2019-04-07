import React, { Component } from 'react'
import { Card } from '../listItems.js'
import BarLoader from '@bit/davidhu2000.react-spinners.bar-loader'
import DataStore from "../stores/dataStore"
import * as DataActions from "../actions/dataActions"

class CardPanel extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.onScroll = this.onScroll.bind(this)

    this.state = {
      query: "",
      items: DataStore.getCards(),
      activeTag: DataStore.getActiveTagId(),
      activeCard: DataStore.getActiveCardId(),
      state: DataStore.getCardPanelState()
    }
  }

  componentDidMount() {
    DataStore.on("change", () => {
      this.setState({
        items: DataStore.getCards(),
        state: DataStore.getCardPanelState(),
        activeTag: DataStore.getActiveTagId(),
        activeCard: DataStore.getActiveCardId()
      })
    })
  }
  componentWillUnmount() {
    DataStore.removeListener("change")
  }

  searchTags(query) {
    let result = DataStore.getCards().items
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

  onScroll() {
    if (this.state.state !== "extended") {
      DataActions.setState("tagPanel", "open")
      DataActions.setState("cardPanel", "extended")

      if (this.state.activeCard !== '') {
        DataActions.setState("commentPanel", "open")
      }
    }
  }

  render() {

    let tag = this.state.activeTag
    let subTitle = "Click a tag to see comments and answer"

    let list = this.state.items

    if (list.length === 0) {
      list = (<div><BarLoader /></div>)
    } else {
      list = list.map((card) => {

        let active = false
        if (card.id === this.state.activeCard) {
          active = true
        }
        return <Card onClick={this.props.onClick} answered={card.answered} key={card.id} id={card.id} timeCreated={card.timeCreated} question={card.question} body={card.body} active={active} />
      })
    }

    let divStyle = { width: 0 }
    switch (this.state.state) {
      case "extended":
        divStyle.width = "50%"
        break
      case "open":
        divStyle.width = "25%"
        break
      default:
        divStyle.width = "0px"
    }

    return (
      <div id={this.props.type + "Panel"} className={this.props.className} style={divStyle} onWheel={this.onScroll}>
        <div className="p-2">
          <h1 className="heading">Cards for {tag}</h1>
          <p>{subTitle}<br />{this.state.state}</p>
          <div className="mb-2">
            <input type="text" className="form-control" placeholder="Search" id="searchCards" value={this.state.query} onChange={this.handleChange} />
          </div>
          <div id={this.props.type + "List"}>
            {list}
          </div>
        </div>
      </div>
    )
  }
}


export default CardPanel
