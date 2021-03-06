import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import AddMarkerPopup from './components/AddMarkerPopup';
import SideBar from './components/SideBar';

function saveMarkers(markers) {
  localStorage.setItem('markers', JSON.stringify(markers));
}

function getSavedMarkers() {
  const markers = localStorage.getItem('markers');
  if (markers) {
    return JSON.parse(markers);
  }
  return [];
}


class App extends Component {
  state = {
    initialCenter: {
      lat: 37.774929,
      lng: -122.419416
    },
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    loadInitialPosition: false,
    markers: getSavedMarkers(),
    markerPopupPosition: {},
    markerPosition: {},
    showMarkerPopup: false,
    filterText: '',
    showSideBar: false
  }

  componentDidMount() {
    this.getInitialLocation();
    this.removeZoomHandler();
    window.addEventListener('wheel', this.onCloseMarkerPopup);
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this.onCloseMarkerPopup);
  }

  getInitialLocation = async () => {
    if (navigator.geolocation) {
      this.setState({ loadInitialPosition: true });
      await navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            initialCenter: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            loadInitialPosition: false
          });
        },
        err => {
          this.setState({ loadInitialPosition: false });
          console.warn(`ERROR(${err.code}): ${err.message}`);
        }
      );
    }
  }

  onMapClicked = (props, a, { latLng, pixel }) => {
    this.setState({
      markerPopupPosition: {
        top: pixel.y + 15,
        left: pixel.x - 92
      },
      markerPosition: { lat: latLng.lat(), lng: latLng.lng() },
      showMarkerPopup: true
    });
    if (this.state.showingInfoWindow) {
      this.clearActiveMarker();
    }
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })

  onAddMarker = (e, title, fromButton) => {
    const { markerPosition: { lat, lng }} = this.state
    const newMarker = [
      {
        title,
        name: title,
        position: { lat, lng },
        showOnMap: true,
        complete: false
      }
    ];
    if ((e.keyCode === 13 || fromButton) && title) {
      this.setState(prevState => {
        const markers = prevState.markers.concat(newMarker);
        saveMarkers(markers);
        return { showMarkerPopup: false, markers };
      })
    }
  } 
  
  onFilterHandler = (e) => {
    this.setState({ filterText: e.target.value });
  }

  onEditHandler = (e, index, isComplete) => {
    e.stopPropagation();    
    const markers = [...this.state.markers];
    const newMarker = {
      ...markers[index],
      ...(!isComplete ? { showOnMap: !markers[index].showOnMap } : {}),
      ...(isComplete ? { complete: !markers[index].complete } : {})
    }
    const newMarkers = [...markers.slice(0, index), newMarker, ...markers.slice(index+1)];
    saveMarkers(newMarkers);
    this.setState({ markers: newMarkers })
  }

  onRemoveHandler = (e, index) => {
    e.stopPropagation();
    const markers = [...this.state.markers];
    const newMarkers = [...markers.slice(0, index), ...markers.slice(index+1)];
    saveMarkers(newMarkers);
    this.setState({ markers: newMarkers })
  }

  onCloseMarkerPopup = () => this.setState({ showMarkerPopup: false })
  onSideBarHandler = () => {
    this.setState(prevState => ({ showSideBar: !prevState.showSideBar }))
  }

  removeZoomHandler = () => {
    setTimeout(() => {
      const elements = document.getElementsByClassName('gmnoprint');
      if (elements.length > 0) {
        for (let element of elements) {
          element.remove();
        }
      } else {
        this.removeZoomHandler()
      }
    }, 1000)
  }

  clearActiveMarker = () => {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    });
  }

  renderMarkers = ({ title, name, position }, i) => (
    <Marker
        key={i}
        title={title}
        name={name}
        position={position}
        onClick={this.onMarkerClick}
      />
  )

  render() {
    const {
      loadInitialPosition,
      initialCenter,
      activeMarker,
      showingInfoWindow,
      selectedPlace,
      markerPopupPosition,
      showMarkerPopup,
      filterText,
      showSideBar
    } = this.state;
    let { markers } = this.state;
    
    if (filterText) {
      markers = markers.filter(({ name }) => name.toLowerCase().includes(filterText.toLowerCase()))
    }
    if (loadInitialPosition) return <div />;

    return (
      <div className='App'>
        {!showSideBar && <span className='glyphicon glyphicon-arrow-right rigthArrow' onClick={this.onSideBarHandler} /> }  
        <SideBar
          markers={markers}
          onEdit={this.onEditHandler}
          onFilter={this.onFilterHandler}
          onRemove={this.onRemoveHandler}
          onClosed={this.onSideBarHandler}
          open={showSideBar}
        />
        {showMarkerPopup && (
          <AddMarkerPopup
            onEnter={this.onAddMarker}
            onClose={this.onCloseMarkerPopup}
            style={markerPopupPosition}
          />
        )}
        <Map
          initialCenter={initialCenter}
          google={this.props.google}
          onClick={this.onMapClicked}
          onDragend={this.onCloseMarkerPopup}
          zoom={14}
        >
          <Marker onClick={this.onMarkerClick} name={'Current location'} />
          {markers.filter(({ showOnMap }) => showOnMap).map(this.renderMarkers)}
          <InfoWindow marker={activeMarker} visible={showingInfoWindow} onClose={this.clearActiveMarker}>
            <div>
              <h1>{selectedPlace.name}</h1>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'YOUR_API_KEY'
})(App);
