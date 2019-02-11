import React, {Component} from "react";
import "./App.css";

class Hover extends Component {
    render() {
        return (
            <div className={this.props.alive? "alive": "dead"}><div>GAME OVER</div></div>
        );
    }
}

export default Hover;