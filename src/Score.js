import React, {Component} from "react";
import "./App.css";

class Score extends Component {
    render() {
        return (
            <div id="score-board">
                <div id="score-info"><div>SCORE</div></div>
                <div id="score-value"><div>{this.props.score}</div></div>
            </div>
        );
    }
}

export default Score;
