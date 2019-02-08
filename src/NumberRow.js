import React, {Component} from "react";
import "./App.css";
import NumberCell from "./NumberCell"

class NumberRow extends Component {
    render() {
        const numberRow = this.props.numberRow;
        const numberRowContent = numberRow.map((number) =>
            <NumberCell key={number.id} number={number}/>
        );
        return (
            <div className="number-row">{numberRowContent}</div>
        );
    }
}

export default NumberRow;