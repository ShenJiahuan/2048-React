import React, {Component} from 'react';
import './App.css';
import Grid from './Grid'
import NumberTable from './NumberTable'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {grid: new Grid(), beginX: 0, beginY: 0, endX: 0, endY: 0, enableSwipe: false};
    }

    static getPosDuringEvent(e) {
        var X, Y;
        if (e.touches !== undefined) {
            X = e.touches[0].screenX;
            Y = e.touches[0].screenY;
        } else {
            X = e.screenX;
            Y = e.screenY;
        }
        return [X, Y];
    }

    componentDidMount() {
        var events = {
            "keydown": this.onKeyPressed,
            "touchstart": this.onTouchStart,
            "mousedown": this.onTouchStart,
            "touchmove": this.onTouchMove,
            "touchend": this.onTouchEnd,
            "mouseup": this.onTouchEnd,
            "gesturestart": this.onGestureStart,
        };

        for (var e in events) {
            document.addEventListener(e, events[e].bind(this));
        }
    }

    onKeyPressed(e) {
        var legalKey = false;
        var grid = this.state.grid;
        switch (e.keyCode) {
            case 37:
                legalKey = grid.action("left");
                break;
            case 38:
                legalKey = grid.action("up");
                break;
            case 39:
                legalKey = grid.action("right");
                break;
            case 40:
                legalKey = grid.action("down");
                break;
            default:
                break;
        }
        if (legalKey) {
            grid.addValue();
        }
        this.setState({grid: grid});
        e.preventDefault();
    }

    onTouchStart(e) {
        var [X, Y] = App.getPosDuringEvent(e);
        this.setState({beginX: X, beginY: Y, endX: X, endY: Y, enableSwipe: true});
        e.preventDefault();
    }

    onTouchMove(e) {
        var [X, Y] = App.getPosDuringEvent(e);
        this.setState({endX: X, endY: Y});
        this.setState({endX: X, endY: Y});
        e.preventDefault();
    }

    onTouchEnd(e) {
        var grid = this.state.grid;
        var [beginX, beginY] = [this.state.beginX, this.state.beginY];
        var [endX, endY] = [this.state.endX, this.state.endY];
        if (Math.pow(endX - beginX, 2) + Math.pow(endY - beginY, 2) > 10 && this.state.enableSwipe) {
            var legalKey = false;
            if (Math.abs(beginX - endX) > Math.abs(beginY - endY)) {
                legalKey = grid.action(beginX < endX ? "right" : "left");
            } else {
                legalKey = grid.action(beginY < endY ? "down" : "up");
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
            <NumberTable numbers={this.state.grid.numbers}/>
        );
    }
}

export default App;
