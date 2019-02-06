import {Component} from 'react';
import './App.css';

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
        this.numbers = numbers;
        for (var k = 0; k < 2; ++k) {
            this.addValue();
        }
    }

    upLeftTranspose() {
        var original = this.numbers;
        var copy = Array(original[0].length);
        for (var k = 0; k < original[0].length; ++k) {
            copy[k] = Array(original.length);
        }
        for (var i = 0; i < original.length; ++i) {
            for (var j = 0; j < original[i].length; ++j) {
                copy[j][i] = original[i][j];
            }
        }
        this.numbers = copy;
    }

    upDownTranspose() {
        var original = this.numbers;
        var copy = Array(original.length);
        for (var i = 0; i < original.length; ++i) {
            copy[i] = original[original.length - i - 1];
        }
        this.numbers = copy;
    }

    leftRightTranspose() {
        this.upLeftTranspose();
        this.upDownTranspose();
        this.upLeftTranspose();
    }

    static getRandom() {
        var row = Math.floor(Math.random() * 4);
        var col = Math.floor(Math.random() * 4);
        return [row, col];
    }

    addValue() {
        var found = false;
        while (!found) {
            var [row, col] = Grid.getRandom();
            if (this.numbers[row][col] === "") {
                this.numbers[row][col] = [Math.random() > 0.5 ? 4 : 2, "new"];
                found = true;
            }
        }
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
            if (numberRow[j] !== "" && numberRow[j + 1] !== "" && numberRow[j][0] === numberRow[j + 1][0]) {
                numberRow[j][0] *= 2;
                numberRow[j][1] = "merged";
                numberRow[j + 1] = "";
                isMerged = true;
            }
        }
        return [numberRow, isMerged];
    }

    leftMoveAndMerge() {
        var isChanged = false;
        for (var i = 0; i < 4; ++i) {
            var action1 = Grid.move(this.numbers[i]);
            this.numbers[i] = action1[0];
            var action2 = Grid.merge(this.numbers[i]);
            this.numbers[i] = action2[0];
            var action3 = Grid.move(this.numbers[i]);
            this.numbers[i] = action3[0];
            isChanged = isChanged || action1[1] || action2[1] || action3[1];
        }
        return isChanged;
    }

    resetIsNew() {
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 4; ++j) {
                if (this.numbers[i][j] !== "") {
                    this.numbers[i][j][1] = "none";
                }
            }
        }
    }

    action(direction) {
        this.resetIsNew();
        var isChanged;
        if (direction === "up") {
            this.upLeftTranspose();
            isChanged = this.leftMoveAndMerge();
            this.upLeftTranspose();
        } else if (direction === "down") {
            this.upDownTranspose();
            this.upLeftTranspose();
            isChanged = this.leftMoveAndMerge();
            this.upLeftTranspose();
            this.upDownTranspose();
        } else if (direction === "right") {
            this.leftRightTranspose();
            isChanged = this.leftMoveAndMerge();
            this.leftRightTranspose();
        } else {
            isChanged = this.leftMoveAndMerge();
        }
        return isChanged;
    }
    render() {
        return null;
    }
}

export default Grid;