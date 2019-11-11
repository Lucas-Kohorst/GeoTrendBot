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
  render() {
    return (
      <div>
        <ForkMeOnGithub
          repo="https://github.com/whatthefoo/fork-me-on-github"
          colorBackground="white"
          colorOctocat="black"
          side="right"
        />
        <h1>GeoTrendBot</h1>
        <p>Visualize trends on Twitter</p>
        <img src={require("./map.png")} alt="Example Map" height={400} style={{ padding: "2em" }}/>
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
