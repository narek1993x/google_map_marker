import React, { Component } from 'react'
import './SideBar.styl'

export default class SideBar extends Component {
  renderMarkers = ({ name }, i) => (
    <li 
      key={i}
      className="list-group-item"
    >
      <p>{name}</p>
      <input type="checkbox" className="input-group-text"/>
    </li>
  )
  render() {
    const { markers } = this.props;
    return (
      <div className="sideBar">
        <ul className="list-group">
          {markers.map(this.renderMarkers)}
        </ul>
      </div>
    )
  }
}
