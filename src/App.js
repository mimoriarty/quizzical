import React, {useState, useEffect} from "react"
import {nanoid} from "nanoid"
import Intro from "./components/Intro/Intro"
import Quiz from "./components/Quiz/Quiz"
import Loader from "./components/Loader/Loader"
import "./App.css";

const OPEN_TRIVIA_URL = "https://opentdb.com/api.php?amount=5&category=11&difficulty=medium&type=multiple"

 const App = () => {
    const [appConfig, setAppConfig] = useState({
        intro: true,
        checking: false,
        score: 0
    })
    const [quizs, setQuizs] = useState([])

    useEffect(() => {
        if (!appConfig.intro && !appConfig.ckecking && quizs.length === 0) {
            function normalizeQuizs(quizList) {
                return quizList.map(quiz => {
                    const {incorrect_answers, correct_answer, question} = quiz
                    const answersArray = [...incorrect_answers, correct_answer].map(getAnswer)
                    
                    function getAnswer(answer) {
                        return {
                            id: nanoid(),
                            value: decodeHtml(answer),
                            selected: false,
                            correct: false,
                            error: false,
                            valid: answer === correct_answer
                        }
                    }
        
                    return {
                        ...quiz,
                        answers: shuffle(answersArray),
                        question: decodeHtml(question),
                        toggleQuiz: toggleQuiz,
                        id: nanoid()
                    }
                })
            }
    
            fetch(OPEN_TRIVIA_URL)
                .then(res => res.json())
                .then(data => setQuizs(prevState => [...prevState, ...normalizeQuizs(data.results)]))
        }
    }, [appConfig, quizs])
    
    useEffect(() => {
        if(appConfig.checking) {
            setQuizs(prevQuizs => prevQuizs.map(quiz => {
                quiz.answers.forEach(answer => {
                    if (answer.selected && answer.valid) {
                        answer.correct = true
                    } else if (answer.selected && !answer.valid) {
                        answer.inValid = true
                    }
                    answer.selected = false
                })
                
                return quiz
            }))
        }
    },[appConfig.checking])
    
    useEffect(() => {
        if (appConfig.checking) {    
            setAppConfig(prevConfig => ({
                ...prevConfig,
                score: quizs.reduce((acc,act) => {
                    const success = act.answers.some(answer => answer.correct)
                    
                    if (success){
                        acc++
                    }
                    
                    return acc
                },0)
            }))
        }
    },[appConfig.checking, quizs])
    
    function startQuiz() {
        setAppConfig(prevConfig => ({
            ...prevConfig,
            intro: false
        }))
    }

    function toggleQuiz(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        const {quizId, answerId} = ev.currentTarget.dataset
        setQuizs(oldQuizs => oldQuizs.map(quiz => {
            return quiz.id !== quizId
                ? quiz
                : {
                    ...quiz,
                    answers: quiz.answers.map(answer => ({
                        ...answer,
                        selected: answer.id !== answerId ? false : !answer.selected
                    }))
                }
        }))
    }
    
    function checkAnswers() {
        if (!appConfig.checking) {
            setAppConfig(prevConfig => ({
                ...prevConfig,
                checking: true
            }))
        } else {
            setAppConfig(prevConfig => ({
                ...prevConfig,
                checking: false
            }))
            setQuizs([])
        }
    }
    
    function decodeHtml(txt) {
        const elem = document.createElement('textarea')
        
        elem.innerHTML = txt
        
        return elem.value
    }
    
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
        }

        return array
    }
    
    const quizElements = quizs.map((quiz,k) => <Quiz {...quiz} key={k} />)
    
    return (
        <div className="app--background">
            <React.StrictMode>
            <span className="blob-1"></span>
            <span className="blob-2"></span>
            {appConfig.intro && <Intro startQuiz={startQuiz} />}
            {quizs.length === 0 &&  <Loader />}
            <div className="questions--container">
                <ul>
                    {quizElements}
                </ul>
                <div className="tools--container">
                    {appConfig.checking && <span>You scored {appConfig.score}/5 correct answers</span>}
                    <button className="quiz--button" onClick={checkAnswers}>
                        {appConfig.checking ? "Play again" : "Check answers"}
                    </button>
                </div>
            </div>
            </React.StrictMode>
        </div>
    )
}

export default App