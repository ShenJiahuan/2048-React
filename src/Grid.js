import {Component} from "react";
import "./App.css";

class Grid extends Component {
    constructor(props) {
        super(props);
        let numbers = new Array(4);
        for (let i = 0; i < 4; ++i) {
            numbers[i] = new Array(4);
            for (let j = 0; j < 4; ++j) {
                numbers[i][j] = "";
            }
        }
        this.numbers = numbers;
        this.score = 0;
        for (let i = 0; i < 2; ++i) {
            this.addValue();
        }
    }

    upLeftTranspose() {
        let original = this.numbers;
        let copy = Array(original[0].length);
        for (let i = 0; i < original[0].length; ++i) {
            copy[i] = Array(original.length);
        }
        for (let i = 0; i < original.length; ++i) {
            for (let j = 0; j < original[i].length; ++j) {
                copy[j][i] = original[i][j];
            }
        }
        this.numbers = copy;
    }

    upDownTranspose() {
        let original = this.numbers;
        let copy = Array(original.length);
        for (let i = 0; i < original.length; ++i) {
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
        let row = Math.floor(Math.random() * 4);
        let col = Math.floor(Math.random() * 4);
        return [row, col];
    }

    addValue() {
        let found = false;
        while (!found) {
            let [row, col] = Grid.getRandom();
            if (this.numbers[row][col] === "") {
                this.numbers[row][col] = [Math.random() > 0.5 ? 4 : 2, "new"];
                found = true;
            }
        }
    }

    move(rowNum) {
        let isMoved = false;
        let jInc = true;
        for (let j = 0; j < 3;) {
            if (this.numbers[rowNum][j] !== "") {
                ++j;
                continue;
            }
            jInc = true;
            for (let k = j; k < 3; ++k) {
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
        let isMerged = false;
        for (let j = 0; j <= 2; ++j) {
            if (this.numbers[rowNum][j] !== "" && this.numbers[rowNum][j + 1] !== "" &&
                this.numbers[rowNum][j][0] === this.numbers[rowNum][j + 1][0]) {
                this.numbers[rowNum][j][0] *= 2;
                this.numbers[rowNum][j][1] = "merged";
                this.numbers[rowNum][j + 1] = "";
                isMerged = true;
                this.score += this.numbers[rowNum][j][0];
            }
        }
        return isMerged;
    }

    leftMoveAndMerge() {
        let isChanged = false;
        for (let i = 0; i < 4; ++i) {
            let action1 = this.move(i);
            let action2 = this.merge(i);
            let action3 = this.move(i);
            isChanged = isChanged || action1 || action2 || action3;
        }
        return isChanged;
    }

    resetIsNew() {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                if (this.numbers[i][j] !== "") {
                    this.numbers[i][j][1] = "none";
                }
            }
        }
    }

    transpose(direction, reset) {
        switch (direction) {
            case "up":
                this.upLeftTranspose();
                break;
            case "down":
                if (reset) {
                    this.upLeftTranspose();
                    this.upDownTranspose();
                } else {
                    this.upDownTranspose();
                    this.upLeftTranspose();
                }
                break;
            case "right":
                this.leftRightTranspose();
                break;
            default:
                break;
        }
    }

    action(direction) {
        this.resetIsNew();
        this.transpose(direction, false);
        let isChanged = this.leftMoveAndMerge();
        this.transpose(direction, true);
        return isChanged;
    }

    alive() {
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                if (this.numbers[i][j] === "") {
                    return true;
                }
                if (i < 3 && this.numbers[i + 1][j] !== "" && this.numbers[i][j][0] === this.numbers[i + 1][j][0]) {
                    return true;
                }
                if (j < 3 && this.numbers[i][j + 1] !== "" && this.numbers[i][j][0] === this.numbers[i][j + 1][0]) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        return null;
    }
}

export default Grid;