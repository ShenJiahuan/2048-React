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

    move(rowNum) {
        var isMoved = false;
        var jInc = true;
        for (var j = 0; j < 3;) {
            if (this.numbers[rowNum][j] !== "") {
                ++j;
                continue;
            }
            jInc = true;
            for (var k = j; k < 3; ++k) {
                this.numbers[rowNum][k] = this.numbers[rowNum][k + 1];
                if (this.numbers[rowNum][k]) {
                    isMoved = true;
                    jInc = false;
                }
            }
            this.numbers[rowNum][3] = "";
            if (jInc) {
                ++j;
            }
        }
        return isMoved;
    }

    merge(rowNum) {
        var isMerged = false;
        for (var j = 0; j <= 2; ++j) {
            if (this.numbers[rowNum][j] !== "" && this.numbers[rowNum][j + 1] !== "" &&
                this.numbers[rowNum][j][0] === this.numbers[rowNum][j + 1][0]) {
                this.numbers[rowNum][j][0] *= 2;
                this.numbers[rowNum][j][1] = "merged";
                this.numbers[rowNum][j + 1] = "";
                isMerged = true;
            }
        }
        return isMerged;
    }

    leftMoveAndMerge() {
        var isChanged = false;
        for (var i = 0; i < 4; ++i) {
            var action1 = this.move(i);
            var action2 = this.merge(i);
            var action3 = this.move(i);
            isChanged = isChanged || action1 || action2 || action3;
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
        switch (direction) {
            case "up":
                this.upLeftTranspose();
                isChanged = this.leftMoveAndMerge();
                this.upLeftTranspose();
                break;
            case "down":
                this.upDownTranspose();
                this.upLeftTranspose();
                isChanged = this.leftMoveAndMerge();
                this.upLeftTranspose();
                this.upDownTranspose();
                break;
            case "left":
                isChanged = this.leftMoveAndMerge();
                break;
            case "right":
                this.leftRightTranspose();
                isChanged = this.leftMoveAndMerge();
                this.leftRightTranspose();
                break;
            default:
                break;
        }
        return isChanged;
    }
    render() {
        return null;
    }
}

export default Grid;