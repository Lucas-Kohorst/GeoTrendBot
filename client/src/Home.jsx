import React from "react";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterFollowButton,
  TwitterMentionButton
} from "react-twitter-embed";
import ForkMeOnGithub from "fork-me-on-github";
import "./App.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trends: []
    };
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
            <a
              href={
                "https://geotrendbot.herokuapp.com/" +
                JSON.stringify(trend.name).split("#")[1]
              }
            >
              {trend.name}
            </a>
          </div>
        ))}
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
