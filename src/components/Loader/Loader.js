import React, {Component} from "react";
import "./Loader.css";

export default class LoaderComponent extends Component {
  render() {
    return (
      <div className="loader--container">
        <div className="lds-dual-ring"></div>
      </div>
    );
  }
}