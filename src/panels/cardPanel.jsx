import React, { Component } from 'react'
import { Card } from '../listItems.js'
import BarLoader from '@bit/davidhu2000.react-spinners.bar-loader'

class CardPanel extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      query: "",
      items: [] ,
      internal: false,
    }
  }
  static getDerivedStateFromProps(props, state) {
    if ( state.internal === true ) {  //  ignore if internal update to state
      return {internal:false}
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
      .filter(function(item) {
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

  handleChange(e){
    let query = e.target.value.trim()
    let items = this.searchTags(query)

    console.log(items);
    this.setState({
      query: e.target.value,
      items: items,
      internal: true
    })
  }

  render() {

    let title = "Cards"
    let subTitle = "Click a tag to see comments and answer"

    let list = this.state.items

    console.log(list);
    if (list.length === 0) {
      list = (<div><BarLoader /></div>)
    } else {
      list = list.map((card) => <Card className="row card" answered={card.answered} key={card.id} id={card.id} timeCreated={card.timeCreated} question={card.question} body={card.body} />)
    }

    // <div id="panel1">{this.props.type} {list}</div>)
    return (
      <span id={this.props.type + "Panel"} className="bg-primary card">
        <h1 className="heading">{title}</h1>
        <p>{subTitle}<br />{this.state.state}</p>
        <div className="form-inline justify-content-center p-1">
          <input type="text" className="form-control" placeholder="Search" id="searchCards" value={this.state.query} onChange={this.handleChange}/>
        </div>
        <div id={this.props.type + "List"}>
          {list}
        </div>
      </span>

    )
  }
}


export default CardPanel
