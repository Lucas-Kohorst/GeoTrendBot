import React from "react";
import {
  TwitterTimelineEmbed,
  TwitterFollowButton,
  TwitterMentionButton
} from "react-twitter-embed";
import ForkMeOnGithub from "fork-me-on-github";
import "./App.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trends: [],
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    let trends = [];
    const response = await fetch("/trends/");
    const body = await response.json();
    console.log(body);
    for (var i = 0; i < 10; i++) {
      trends.push(body[0].trends[i]);
    }
    this.setState({
      trends: trends
    });
  }

  _getURL = name => {
    var baseURL = "https://geotrendbot.herokuapp.com/";
    var nameURL = JSON.stringify(name).split("#")[1]
      ? JSON.stringify(name).split("#")[1]
      : name;
    var url = baseURL + nameURL;
    return url;
  };

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    var trend = this.state.value;
    if (trend.includes("#")) {
      trend = trend.split("#")[1];
    }
    window.location.href = "https://geotrendbot.herokuapp.com/" + trend;
  }

  render() {
    return (
      <div style={{ padding: "2em" }}>
        <ForkMeOnGithub
          repo="https://github.com/lucas-kohorst/GeoTrendBot"
          colorBackground="white"
          colorOctocat="black"
          side="right"
        />
        <h1>GeoTrendBot</h1>
        <p>Visualize trends on Twitter</p>
        <h3>Popular Trends</h3>
        {this.state.trends.map(trend => (
          <div>
            <a href={this._getURL(trend.name)}>{trend.name}</a>
          </div>
        ))}
        <div className={"form-trend"}>
          <input
            type="text"
            placeholder="Trend"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button onClick={this.handleSubmit}>Visualize</button>
        </div>
        <div className="centerContent">
          <div className="selfCenter standardWidth">
            <TwitterTimelineEmbed
              sourceType="timeline"
              screenName="geotrendbot"
              options={{ height: 400 }}
            />
            <div className={"flex-row"}>
              <TwitterFollowButton screenName={"geotrendbot"} />
              <TwitterMentionButton screenName={"geotrendbot"} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Home };
