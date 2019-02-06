import React, {Component} from 'react';
import './App.css';

class NumberCell extends Component {
    render() {
        var className = "number-cell num-" + (this.props.number === "" ? "null" : this.props.number);
        return (
            <div className={className}>{this.props.number}</div>
        );
    }
}

export default NumberCell;
