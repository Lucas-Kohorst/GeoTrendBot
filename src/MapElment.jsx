import React from "react";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  withLeaflet, 
  LayerGroup
} from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";

const WrappedSearch = withLeaflet(ReactLeafletSearch);

class MapElement extends React.Component {
  constructor(props) {
    super(props);
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const value = params.get("search");

    this.state = {
      search: value,
      positions: [],
      streetView: null,
      tweet: "",
      name: "",
      timestamp: "",
      source: "",
      hashtag: props.hashtag ? props.hashtag : props.match.params.hashtag
    };
  }

  componentDidMount() {
    this._callSearchAPI().then(async res => {
      for (var i = 0; i < res.tweets.length; i++) {
        if (res.tweets[i].user.location != "") {
          this.setState({
            tweet: res.tweets[i].text,
            name: res.tweets[i].user.name,
            timestamp: res.tweets[i].created_at.split("+")[0] // removing the +milli
          });
          await fetch(
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
              res.tweets[i].user.location +
              ".json?access_token=pk.eyJ1IjoibHVjYXNrb2hvcnN0IiwiYSI6ImNrMmc4ZzR1ajBzYmgzam1vbzBscHo1ajIifQ.mRP73FdC3Fhwe6QShpZhQw"
          )
            .then(response => {
              if (!response.ok) {
                throw new Error("Network response was not ok.");
              }
              return response.json();
            })
            .then(data => {
              try {
                var long = data.features[0].geometry.coordinates[0];
                var lat = data.features[0].geometry.coordinates[1];
                var name = this.state.name;
                var tweet = this.state.tweet;
                var timestamp = this.state.timestamp;
                var source = this.state.source;
                this.setState(prevState => ({
                  positions: [
                    ...prevState.positions,
                    {
                      lat: lat,
                      long: long,
                      name: name,
                      tweet: tweet,
                      timestamp: timestamp,
                      source: source
                    }
                  ]
                }));
              } catch (error) {}
            })
            .catch(err => {});
        }
      }
    });
  }

  _callSearchAPI = async () => {
    const response = await fetch("/search/" + this.state.hashtag);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  _createMarkers = positions => {
    let markers = [];
    for (var i = 0; i < positions.length; i++) {
      markers.push(
        <Marker position={[positions[i].lat, positions[i].long]} key={i}>
          <Popup>
            <h1>{positions[i].name}</h1>
            <h3>{positions[i].timestamp}</h3>
            <a href={positions[i].source} target="_blank">
              <h2>{positions[i].tweet}</h2>
            </a>
          </Popup>
        </Marker>
      );
    }
    return markers;
  };

  render() {
    return (
      <div>
        <LeafletMap
          className="sidebar-map"
          center={[50, 10]}
          zoom={3}
          maxZoom={10}
          attributionControl={true}
          zoomControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={true}
          easeLinearity={0.35}
        >
          <WrappedSearch
            position="topright"
            zoom={10}
            openSearchOnLoad={true}
            showMarker={false}
            showPopup={false}
            inputPlaceholder={"Search Latitude, Longitude"}
            closeResultsOnClick={true}
          />
          <LayersControl position="bottomleft">
              <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="OpenStreetMap.Mapnik" checked>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
          </LayersControl>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Fork me on <a href="https://github.com/Lucas-Kohorst/GeoTrendBot">Github</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this._createMarkers(this.state.positions)}
        </LeafletMap>
      </div>
    );
  }
}

export { MapElement };
