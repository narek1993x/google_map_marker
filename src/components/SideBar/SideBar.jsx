import React, { Component } from 'react'
import SearchBar from '../SearchBar';
import './SideBar.styl'

export default class SideBar extends Component {
  renderMarkers = ({ name, showOnMap, complete }, i) => (
    <li 
      key={i}
      className={`list-group-item${complete ? ' complete' : ''}`}
      onClick={(e) => this.props.onEdit(e, i, true)}
    >
      <p>{name}</p>
      <div className="toggles">
        <button 
          type="button" 
          className={`btn btn-${showOnMap ? 'warning' : 'success'}`}
          disabled={complete}
          onClick={(e) => this.props.onEdit(e, i)}>{showOnMap ? 'Hide' : 'Show'} on Map</button>
        <span
          className='cross'
          onClick={(e) => this.props.onRemove(e, i)}>
          &#x2715;
        </span>
      </div>
    </li>
  )
  render() {
    const { markers, open, onFilter, onClosed } = this.props;
    return (
      <div className={`sideBar ${open ? 'open' : 'close'}`}>
        <span className='glyphicon glyphicon-arrow-left leftArrow' onClick={onClosed} />
        <h3>Markers</h3>
        <SearchBar  onFilter={onFilter}/>
        <ul className="list-group markers">
          {markers.map(this.renderMarkers)}
        </ul>
      </div>
    )
  }
}
