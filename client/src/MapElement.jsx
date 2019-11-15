import React from "react";
import {
  Map as LeafletMap,
  TileLayer,
  Popup,
  LayersControl,
  withLeaflet,
  FeatureGroup,
  Marker
} from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import HeatmapLayer from "react-leaflet-heatmap-layer";

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
          var user_id = res.tweets[i].user.screen_name
          var tweet_id = res.tweets[i].id_str
          this.setState({
            tweet: res.tweets[i].text,
            name: res.tweets[i].user.name,
            timestamp: res.tweets[i].created_at.split("+")[0], // removing the +milli
            source: "https://twitter.com/" + user_id + "/statuses/" + tweet_id
          });
          await fetch(
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
              res.tweets[i].user.location +
              ".json?access_token=pk.eyJ1IjoibHVjYXNrb2hvcnN0IiwiYSI6ImNrMmc4ZzR1ajBzYmgzam1vbzBscHo1ajIifQ.mRP73FdC3Fhwe6QShpZhQw"
          )
            .then(response => {
              if (!response.ok) {
                throw new Error("Network Response Error");
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

  _createPoints = () => {
    var positions = this.state.positions
    var points = []
    for (var i = 0; i < positions.length; i++) {
      var point = []
      point.push(positions[i].lat)
      point.push(positions[i].long)
      point.push("1500")
      points.push(point)
    }
    return points
  }

  _createMarkers = positions => {
    let markers = [];
    for (var i = 0; i < positions.length; i++) {
      markers.push(
        <Marker
          position={[positions[i].lat, positions[i].long]}
          key={i}
          fillOpacity={1}
          radius={5}
        >
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
            showCircle={false}
            showPopup={false}
            inputPlaceholder={"Search Latitude, Longitude"}
            closeResultsOnClick={true}
          />
          <LayersControl position={"bottomleft"}>
            <LayersControl.BaseLayer name="Mapnik" checked>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Mapnik Dark">
              <TileLayer
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Thunder Dark">
              <TileLayer
                url="https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=271bf3a0f63848d49a770806ac397322"
                attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Outdoors">
              <TileLayer
                url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=271bf3a0f63848d49a770806ac397322"
                attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Neighborhood">
              <TileLayer
                url="https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=271bf3a0f63848d49a770806ac39732"
                attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Landscape">
              <TileLayer
                url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=271bf3a0f63848d49a770806ac397322"
                attribution="&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors"
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="Heatmap" checked>
              <FeatureGroup color="purple">
                <HeatmapLayer
                  // fitBoundsOnLoad
                  points={this._createPoints()}
                  longitudeExtractor={m => m[1]}
                  latitudeExtractor={m => m[0]}
                  intensityExtractor={m => parseFloat(m[2])}
                />
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Markers" checked>
              <FeatureGroup color="purple">
                {this._createMarkers(this.state.positions)}
              </FeatureGroup>
            </LayersControl.Overlay>
          </LayersControl>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Fork me on <a href="https://github.com/Lucas-Kohorst/GeoTrendBot">Github</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LeafletMap>
      </div>
    );
  }
}

export { MapElement };
