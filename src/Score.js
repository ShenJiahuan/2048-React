import React, {Component} from 'react';
import './App.css';

class Score extends Component {
    render() {
        return (
            <div id="score-board">
                <div id="score-info">分数</div>
                <div id="score-value">{this.props.score}</div>
            </div>
        );
    }
}

export default Score;
