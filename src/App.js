import React, {Component} from 'react';
import './App.css';
import NumberRow from './NumberRow'

class Grid extends Component {
    constructor(props) {
        super(props);
        var numbers = new Array(4);
        for (var i = 0; i < 4; ++i) {
            numbers[i] = new Array(4);
            for (var j = 0; j < 4; ++j) {
                numbers[i][j] = "";
            }
        }
        this.state = {numbers: numbers, beginX: 0, beginY: 0, endX: 0, endY: 0, enableSwipe: false};
        this.init();
    }

    upLeftTranspose() {
        var original = this.state.numbers;
        var copy = Array(original[0].length);
        for (var k = 0; k < original[0].length; ++k) {
            copy[k] = Array(original.length);
        }
        for (var i = 0; i < original.length; ++i) {
            for (var j = 0; j < original[i].length; ++j) {
                copy[j][i] = original[i][j];
            }
        }
        this.setState({numbers: copy});
    }

    upDownTranspose() {
        var original = this.state.numbers;
        var copy = Array(original.length);
        for (var i = 0; i < original.length; ++i) {
            copy[i] = original[original.length - i - 1];
        }
        this.setState({numbers: copy});
    }

    static getRandom() {
        var row = Math.floor(Math.random() * 4);
        var col = Math.floor(Math.random() * 4);
        return [row, col];
    }

    addValue() {
        var numbers = this.state.numbers;
        while (true) {
            var [row, col] = Grid.getRandom();
            if (numbers[row][col] === "") {
                numbers[row][col] = Math.random() > 0.5 ? 4 : 2;
                break;
            }
        }
        this.setState({numbers: numbers});
    }

    static move(numberRow) {
        var isMoved = false;
        var jInc = true;
        for (var j = 0; j < 3;) {
            if (numberRow[j] !== "") {
                ++j;
                continue;
            }
            jInc = true;
            for (var k = j; k < 3; ++k) {
                numberRow[k] = numberRow[k + 1];
                if (numberRow[k]) {
                    isMoved = true;
                    jInc = false;
                }
            }
            numberRow[3] = "";
            if (jInc) {
                ++j;
            }
        }
        return [numberRow, isMoved];
    }

    static merge(numberRow) {
        var isMerged = false;
        for (var j = 0; j <= 2; ++j) {
            if (numberRow[j] === numberRow[j + 1] && numberRow[j] !== "") {
                numberRow[j] *= 2;
                numberRow[j + 1] = "";
                isMerged = true;
            }
        }
        return [numberRow, isMerged];
    }

    leftMoveAndMerge() {
        var isChanged = false;
        var numbers = this.state.numbers;
        for (var i = 0; i < 4; ++i) {
            var action1 = Grid.move(numbers[i]);
            numbers[i] = action1[0];
            var action2 = Grid.merge(numbers[i]);
            numbers[i] = action2[0];
            var action3 = Grid.move(numbers[i]);
            numbers[i] = action3[0];
            isChanged = isChanged || action1[1] || action2[1] || action3[1];
        }
        this.setState({numbers: numbers});
        return isChanged;
    }

    action(direction) {
        if (direction === "up") {
            this.upLeftTranspose();
        } else if (direction === "down") {
            this.upDownTranspose();
            this.upLeftTranspose();
        } else if (direction === "right") {
            this.upLeftTranspose();
            this.upDownTranspose();
            this.upLeftTranspose();
        }
        var isChanged = this.leftMoveAndMerge();
        if (direction === "up") {
            this.upLeftTranspose();
        } else if (direction === "down") {
            this.upLeftTranspose();
            this.upDownTranspose();
        } else if (direction === "right") {
            this.upLeftTranspose();
            this.upDownTranspose();
            this.upLeftTranspose();
        }
        return isChanged;
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
        switch (e.keyCode) {
            case 37:
                legalKey = this.action("left");
                break;
            case 38:
                legalKey = this.action("up");
                break;
            case 39:
                legalKey = this.action("right");
                break;
            case 40:
                legalKey = this.action("down");
                break;
            default:
                break;
        }
        if (legalKey) {
            this.addValue();
        }
        e.preventDefault();
    }

    onTouchStart(e) {
        var [X, Y] = Grid.getPosDuringEvent(e);
        this.setState({beginX: X, beginY: Y, endX: X, endY: Y, enableSwipe: true});
        e.preventDefault();
    }

    onTouchMove(e) {
        var [X, Y] = Grid.getPosDuringEvent(e);
        this.setState({endX: X, endY: Y});
        e.preventDefault();
    }

    onTouchEnd(e) {
        var [beginX, beginY] = [this.state.beginX, this.state.beginY];
        var [endX, endY] = [this.state.endX, this.state.endY];
        if (Math.pow(endX - beginX, 2) + Math.pow(endY - beginY, 2) > 10 && this.state.enableSwipe) {
            var legalKey = false;
            if (Math.abs(beginX - endX) > Math.abs(beginY - endY)) {
                legalKey = this.action(beginX < endX ? "right" : "left");
            } else {
                legalKey = this.action(beginY < endY ? "down" : "up");
            }
            if (legalKey) {
                this.addValue();
            }
        }
        this.setState({enableSwipe: false});
        e.preventDefault();
    }

    onGestureStart(e) {
        this.setState({enableSwipe: false});
        e.preventDefault();
    }


    init() {
        for (var i = 0; i < 2; ++i) {
            this.addValue();
        }
    }


    render() {
        const numbers = this.state.numbers;
        const numberTableContent = numbers.map((numberRow) =>
            <NumberRow key={numberRow.id} numberRow={numberRow}/>
        );
        return (
            <div className="number-table">{numberTableContent}</div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <Grid />
        );
    }
}

export default App;
