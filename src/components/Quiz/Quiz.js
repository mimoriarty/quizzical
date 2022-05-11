import React, {Component} from "react"
import "./Quiz.css"

export default class Quiz extends Component {

    get answerElements() {
        return this.props.answers.map((answer,k) => {
            let classes = "answer"
            if (answer.selected) classes = classes.concat(" selected")
            if (answer.valid) classes = classes.concat(" valid")
            if (answer.correct) classes = classes.concat(" correct")
            if (answer.inValid) classes = classes.concat(" error")
            
            return <span
                    className={classes}
                    /* onClick={ev => this.props.toggleQuiz(ev, this.props.id, answer.id)} */
                    onClick={this.props.toggleQuiz}
                    data-answer-id={answer.id}
                    data-quiz-id={this.props.id}
                    key={k}
                >
                    {answer.value}
                </span>
        })
    }
    
    render() {
        return (
            <li>
                <p>{this.props.question}</p>
                <div className="answers--container">
                    {this.answerElements}
                </div>
            </li>
        )
    }
}