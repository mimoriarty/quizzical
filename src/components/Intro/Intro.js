import React, {Component} from "react";
import "./Intro.css";

export default class IntroComponet extends Component {
  render() {
    return (
      <div className="intro--container">
        <header>
          <h1>Quizzical</h1>
          <p>Make the quiz if you Dare!!</p>
        </header>
        <button className="quiz--button" onClick={this.props.startQuiz}>
          Start quiz
        </button>
      </div>
    );
  }
}
