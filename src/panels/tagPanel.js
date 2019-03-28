import React, {Component} from 'react';
import { Tag } from "../listItems.js"

class TagPanel extends Component {
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

    let title = "Tags"
    let subTitle = "Click a tag to see cards"

    let list = this.state.items.map((tag) => <Tag onClick={this.props.onClick} key={tag.id} tag={tag.tag} id="panel1" />)
    // <div id="panel1">{this.props.type} {list}</div>)
    return (
      <div id={this.props.type + "Panel"} className="bg-primary">
        <h1 className="heading text-light">{title}</h1>
        <p className="text-light">{subTitle}<br />{this.state.state}</p>
        <div className="form-inline justify-content-center p-1">
          <input type="text" className="form-control" placeholder="Search" id="searchTags" value={this.state.query} onChange={this.handleChange}/>
        </div>
        <div id={this.props.type + "List"}>
          {list}
        </div>
      </div>

    )
  }
}

export default TagPanel
