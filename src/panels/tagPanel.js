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

    let list = this.state.items.map((tag) => <Tag onClick={this.props.onClick} key={tag.id} tag={tag.tag} id={tag.id} />)

    let divStyle = {width:0}
    switch (this.props.state) {
      case "extended":
        divStyle.width = "50%"
        break
      case "open":
        divStyle.width = "25%"
        break
      default:
        divStyle.width = "25%"
    }


    return (
      <div id={this.props.type + "Panel"} className={this.props.className} style={divStyle}>
      <div className="p-2">
        <h1>{title}</h1>
        <p>{subTitle}<br />{this.state.state}</p>
        <div className="justify-content-center mb-2">
          <input type="text" className="form-control" placeholder="Search" id="searchTags" value={this.state.query} onChange={this.handleChange}/>
        </div>
        <div id={this.props.type + "List"}>
          {list}
        </div>
        </div>
      </div>
    )
  }
}

export default TagPanel
