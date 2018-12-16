import React, { Component } from 'react';
import './AddMarkerPopup.styl';

export default class AddMarkerPopup extends Component {
  state = {
    isAddMarker: false,
    markerTitle: ''
  }

  showInputHandler = () => {
    this.setState({ isAddMarker: true });
  }

  hidePopupHanler = () => {
    this.setState({ isAddMarker: false });
    this.props.onClose();
  }

  onTitleChangeHandler = (e) => {
    this.setState({ markerTitle: e.target.value })
  }

  render() {
    const { isAddMarker, markerTitle } = this.state;
    const { onEnter, style } = this.props;
    let content;

    if (isAddMarker) {
      content = (
        <div className='input-wrapper'>
          <input
            autoFocus
            type='text'
            className='form-control'
            onFocus={ev => {
              const currentTarget = ev.currentTarget
              setTimeout(() => currentTarget.select(), 100)
            }}
            onChange={this.onTitleChangeHandler}
            onKeyDown={e => onEnter(e, markerTitle)}
          />
          <span
            className='cross'
            onClick={this.hidePopupHanler}>
            &#x2715;
          </span>
        </div>
      )
    } else {
      content = (
        <div className='button-wrapper'>
          <p>Add marker here?</p>
          <div>
            <button type="button" className="btn btn-info" onClick={this.showInputHandler}>Yes</button>
            <button type="button" className="btn btn-light" onClick={this.hidePopupHanler}>No</button>
          </div>
        </div>
      )
    }
    return (
      <div className='addMarker' style={style}>
        {content}
      </div>
    );
  }
}
