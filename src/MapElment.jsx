import React from "react";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  CircleMarker
} from "react-leaflet";

class MapElement extends React.Component {
  constructor(props) {
    super(props);
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const value = params.get("search");

    this.state = {
      search: value,
      positions: []
    };
  }

  componentDidMount() {
    this._callSearchAPI().then(res => {
      for (var i = 0; i < res.tweets.length; i++) {
        if (res.tweets[i].user.location != "") {
          var tweet = res.tweets[i].text;
          var name = res.tweets[i].user.screen_name;
          var timestamp = res.tweets[i].created_at;
          // Removing the +mili from the timestamp
          timestamp = timestamp.split("+")[0];
          fetch(
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
                this.setState(prevState => ({
                  positions: [
                    ...prevState.positions,
                    {
                      lat: lat,
                      long: long,
                      name: name,
                      tweet: tweet,
                      timestamp: timestamp
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
    const response = await fetch("/search/teamtrees");
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
        <Marker
          position={[positions[i].lat, positions[i].long]}
          // radius={8}
          key={i}
        >
          <Popup>
            <h1>{positions[i].name}</h1>
            <h3>{positions[i].timestamp}</h3>
            <h2>{positions[i].tweet}</h2>
          </Popup>
        </Marker>
      );
    }
    return markers;
  };

  render() {
    return (
      <LeafletMap
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
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this._createMarkers(this.state.positions)}
      </LeafletMap>
    );
  }
}

export { MapElement };
