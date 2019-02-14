import React, {Component} from "react";
import "./App.css";
import Grid from "./Grid";
import NumberTable from "./NumberTable";
import Score from "./Score";
import Hover from "./Hover";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {grid: new Grid(), beginX: 0, beginY: 0, endX: 0, endY: 0, enableSwipe: false};
    }

    static getPosDuringEvent(e) {
        let X, Y;
        if (e.touches) {
            X = e.touches[0].screenX;
            Y = e.touches[0].screenY;
        } else {
            X = e.screenX;
            Y = e.screenY;
        }
        return [X, Y];
    }

    componentDidMount() {
        let events = {
            "keydown": this.onKeyPressed,
            "touchstart": this.onTouchStart,
            "mousedown": this.onTouchStart,
            "touchmove": this.onTouchMove,
            "touchend": this.onTouchEnd,
            "mousemove": this.onTouchMove,
            "mouseup": this.onTouchEnd,
            "gesturestart": this.onGestureStart,
        };

        for (let e in events) {
            document.addEventListener(e, events[e].bind(this));
        }
    }

    onKeyPressed(e) {
        let legalKey = false;
        let grid = this.state.grid;
        const actionMap = {37: "left", 38: "up", 39: "right", 40: "down"};
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            let action = actionMap[e.keyCode];
            legalKey = grid.action(action);
        }
        if (legalKey) {
            grid.addValue();
        }
        this.setState({grid: grid});
        e.preventDefault();
    }

    onTouchStart(e) {
        let [X, Y] = App.getPosDuringEvent(e);
        this.setState({beginX: X, beginY: Y, endX: X, endY: Y, enableSwipe: true});
        e.preventDefault();
    }

    onTouchMove(e) {
        let [X, Y] = App.getPosDuringEvent(e);
        this.setState({endX: X, endY: Y});
        e.preventDefault();
    }

    onTouchEnd(e) {
        let grid = this.state.grid;
        let [beginX, beginY] = [this.state.beginX, this.state.beginY];
        let [endX, endY] = [this.state.endX, this.state.endY];
        if (Math.pow(endX - beginX, 2) + Math.pow(endY - beginY, 2) > 10 && this.state.enableSwipe) {
            let legalKey = false;
            let action = "";
            if (Math.abs(beginX - endX) > Math.abs(beginY - endY)) {
                action = beginX < endX ? "right" : "left";
            } else {
                action = beginY < endY ? "down" : "up";
            }
            if (action) {
                legalKey = grid.action(action);
            }
            if (legalKey) {
                grid.addValue();
            }
        }
        this.setState({grid: grid, enableSwipe: false});
        e.preventDefault();
    }

    onGestureStart(e) {
        this.setState({enableSwipe: false});
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <Score score={this.state.grid.score}/>
                <NumberTable numbers={this.state.grid.numbers}/>
                <Hover alive={this.state.grid.alive()}/>
            </div>
        );
    }
}

export default App;
