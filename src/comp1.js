import React, {Component} from 'react';

// initialize firebase
var config = {
    apiKey: "AIzaSyACuA8CM5fKm59JMMeE72gNadh6yVCdyvc",
    authDomain: "cards-5c8be.firebaseapp.com",
    databaseURL: "https://cards-5c8be.firebaseio.com",
    projectId: "cards-5c8be",
    storageBucket: "cards-5c8be.appspot.com",
    messagingSenderId: "222433486904"
  };
const firebase = require("firebase")
require("firebase/firestore")
firebase.initializeApp(config)
let db = firebase.firestore()


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

class Tag extends Component {
  render () {

    let tagStyle = {
      "fontSize":"30px",
      cursor:"pointer",
      "textAlign":"center"
    }
    return (
      <span style={tagStyle} onClick={this.props.onClick}><h1 className="title" id={this.props.tag}>&#9776; {this.props.tag}</h1></span>
      // <div><button onClick={this.props.onClick}><h1 className="title" id={this.props.tag}>&#9776; {this.props.tag}</h1></button></div>
    )
  }
}

class Card extends Component {
  render () {
    let answered = this.props.answered ? <p>answered</p> : null
    return (
      <span onClick={null}>
        <div className="card-body p-1">
          <h4 className="card-title text-left">{this.props.cardTitle}</h4>
          <h6 className="comment">{this.props.cardBody}</h6>
          <p className="time">Created: {this.props.timeStamp}</p>
          {answered}
        </div>
    </span>

    )
  }
}


class Comment extends Component {
  render() {
    return (
      <div className="card comCard">
        <h5 className="comment">{this.props.comment}</h5>
        <p className="time">Time: {this.props.timeStamp}</p>
      </div>
    )
  }
}

class Panel extends Component {
  constructor(props) {
    super(props)

    let items
    if (this.props.listItems.items === {}) {
      items = []
    } else {
      items = this.props.listItems.items
    }

    this.state = {
      query: "",
      items: items,
      state: this.props.state
    }

    this.handleChange = this.handleChange.bind(this)
  }

  searchTags(query) {
    let result = this.props.listItems.items.slice()
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

    this.setState({
      query: e.target.value,
      items: items,
    })
  }

  render() {


    let title = this.props.title
    let subTitle = this.props.subTitle

    let listItems

    switch (this.props.type) {
      case "tags":
        listItems = this.state.items.map((item) => {
          return <Tag id={item.id} key={item.id} tag={item.tag} onClick={this.props.onClick}/>
        })
      break;

      case "cards":
        listItems = this.state.items.map((item) => {
          return <Card id={item.id} key={item.id} cardTitle={item.cardTitle} cardBody={item.cardBody} timeStamp={item.timeStamp} answered={item.answered}/>
        })
        break;

      case "comments":
        listItems = this.state.items.map((item) => {
          return <Comment id={item.id} key={item.id} comment={item.comment} timeStamp={item.timeStamp} />
        })
        break;

      default:

    }

    if (this.state.state === "closed") {
      return (<h1>closed</h1>)
    } else {
      return (
        <div id={this.props.type + "Panel"} className="bg-primary">
          <h1 className="heading text-light">{title}</h1>
          <p className="text-light">{subTitle}<br />{this.state.state}</p>
          <div className="form-inline justify-content-center p-1">
            <input type="text" className="form-control" placeholder="Search" id="searchTags" value={this.state.query} onChange={this.handleChange}/>
          </div>
          <div id={this.props.type + "List"}>
            {listItems}
          </div>
        </div>
      )
    }
  }
}

class PanelGroup extends Component {
  constructor(props) {
    super(props)
    this.tagClick = this.tagClick.bind(this)
    let panels = [
      {
        type: "tags",
        title: "Tags",
        state: "extended",
        subTitle: "Click a Tag below to view cards with that tag.",
        listItems: {
          items: []
        },
        onClick:this.tagClick,
      },
      {
        type: "cards",
        state: "closed",
        title: "Questions",
        subTitle: "Click a Card below to view answers.",
        listItems: {
          items: []
        }
      },
      {
        type: "comments",
        state: "closed",
        title: "Answer and comments",
        subTitle: "",
        listItems: {
          items:[]
        }
      }
    ]

    this.state = {
      panels: panels.slice(),
      isLoaded: false,
      tag: null,
      card: null,
    }
  }

  async tagClick(e) {
    console.log(e.target.id);
    let panels = this.state.panels.slice()
    panels[0].state = "open"
    panels[1].state = "extended"
    console.log(this.state);
    await this.setState({
      panels:panels,
      tag: e.target.id
    })
    console.log(this.state);
    this.forceUpdate()
  }

  async componentDidMount() {
    let panels = this.state.panels.slice()
    let tags = await this.getTags()

    tags = tags.map(tag => {
      return {
        tag: tag,
        id: tag
      }
    })
    console.log(tags);
    panels[0].listItems.items = tags
    this.setState({panels:panels, isLoaded:true})
  }

  async getTags() {
    let data = await db.collection("Active").get()
    let tags = data.docs.map(doc => doc.id)

    return tags
  }

  render() {

    if (!this.state.isLoaded) {
      return (<h1>Loading...</h1>)
    }
    let panels = this.state.panels.slice().map((panel) => {
      console.log(panel);
      return <Panel type={panel.type} key={panel.type} title={panel.title} subTitle={panel.subTitle} listItems={panel.listItems} state={panel.state} onClick={panel.onClick}/>
    })
    return (
    <div>
      {panels}
    </div>
    )
  }
}

var exports = {Title, Panel, PanelGroup, Tag, Comment}

export default exports
// module.exports = exports
