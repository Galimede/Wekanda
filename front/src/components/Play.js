import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { Icon, Button, CardPanel} from 'react-materialize';
import { Redirect } from 'react-router-dom';
import PlayQuestion from './PlayQuestion';
import './css/play.css';

export default function Play() {
    const { id_quizz } = useParams();

    const [quizz, setQuizz] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [currentAnswers, setCurrentAnswers] = useState([]);
    const [currentidx, setCurrentidx] = useState(0);

    const [score, setScore] = useState(0);

    /* flag to make it impossible to answer the same Q several times */
    const [answered, setAnswered] = useState(false);
    const [chronoTermine, setChronoTermine] = useState(false);
    const [sec, setSecond] = useState(5);
    

    async function fetchQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then(res => {
                if (res.status === 200) {
                    setQuizz(res.data);
                } else {
                    setQuizz('not found');
                }
            });
    }
    async function fetchQuestions() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}/questions`)
            .then(res => {
                setQuestions(res.data);
                setCurrentQuestion(res.data[currentidx]);
            });
    }

    async function fetchCurrentAnswers() {
        await axios.get(`http://${config.server}/questions/${currentQuestion.id_question}/answers`)
            .then(res => {
                setCurrentAnswers(res.data);
            });
    }

    useEffect(() => {
        fetchQuizz();
        fetchQuestions();
    }, [])

    useEffect(() => {
        setCurrentQuestion(questions[currentidx]);
    }, [currentidx]);

    useEffect(() => {
        if (currentQuestion) fetchCurrentAnswers();
    }, [currentQuestion]);

    useEffect(() => {
    }, [chronoTermine]);

    function handleAnswer(answer) {
        if (!answered && chronoTermine === false) {
            console.log(sec)
            setAnswered(true);
            setChronoTermine(true);
            /* Checking if the user has answered correctly */
            if (answer.correct) {
                setScore(parseInt(score) + 10);
                document.querySelector('#good').style.visibility = 'visible';
            } else {
                setScore(parseInt(score) - quizz.difficulty * 2)
                document.querySelector('#bad').style.visibility = 'visible';
            }
            for (const i of document.querySelectorAll('.material-icons')) {
                i.style.visibility = 'visible';
            }

            /* Checking if the quizz is over */
            if (currentidx < questions.length - 1){
                document.querySelector('#next-button').style.visibility = 'visible';
            }
            else{
                //On post le score
                document.querySelector('#finish-button').style.visibility = 'visible';
            }
        }
    }

    function handleNext() {
        console.log(answered)
        console.log(chronoTermine)
        for (const i of document.querySelectorAll('.material-icons')) {
            i.style.visibility = 'hidden';
        }
        document.querySelector('#next-button').style.visibility = 'hidden';
        document.querySelector('#good').style.visibility = 'hidden';
        document.querySelector('#bad').style.visibility = 'hidden';
        setCurrentidx(parseInt(currentidx) + 1);
        setAnswered(false);
        setChronoTermine(false);
        setSecond(5);
    }

    
    let second = sec;
    if(!chronoTermine){
        //décompte
        var countdown = setInterval(() => {
            if(second > 0){
                second--;
                setSecond(second)
            }
            else{
                console.log("Stop interval")
                clearInterval(countdown);
            } 
        }, 1000)
    }
    else{
        //On arrête le décompte
        console.log('Ca tourne plus');
        //clearInterval(countdown);
    }
    
        
    return (

        <div id='play-container'>

            <div id='quizz-title'>
                {quizz && quizz === 'not found' ? <Redirect to='/' /> : ''}
                <h2>{quizz ? quizz.title : "Quizz not found"}</h2>
            </div>

            {currentQuestion ? <PlayQuestion question={currentQuestion.question} src={currentQuestion.path_file} /> : ''}

            <div id='score'>
                <h2>Score : {score ? score : 0}</h2>
            </div>

            <div id='chrono'>
                {sec === 0 ? 'Terminé !' : 'Temps restant : ' + sec}
            </div>

            <div id='answers'>
                {currentAnswers ?
                    currentAnswers.map((a, idx) => {
                        if (a.path_file.split('.')[1] !== 'jpg') {
                            return (
                                <CardPanel className="answer" key={idx} id={'answer'+idx} onClick={e=>{handleAnswer(a)}}>
                                    <span className="white-text">
                                        {a.answer}
                                    </span>
                                    {a.correct ? <Icon>check</Icon> : <Icon>clear</Icon>}
                                </CardPanel>
                            );
                        } else {
                            return (
                                <CardPanel style={{
                                    backgroundImage: 'url(' + `http://${config.server}/img/${a.path_file}` + ')'}}
                                    className="answer" key={idx} id={'answer'+idx} onClick={e=>{handleAnswer(a)}}
                                >
                                    {a.correct ? <Icon>check</Icon> : <Icon>clear</Icon>}
                                </CardPanel>
                            );
                        }
                    }) : "Answers not found"
                }
            </div>

            <div>
                <p id='good'>Bonne réponse !</p>
            </div>

            <div>
                <p id='bad'>Mauvaise réponse !</p>
            </div>

            <div>
                <Button id='next-button' onClick={e => { handleNext() }}>Next</Button>
            </div>

            <div>
                <Button id='finish-button'>Terminer</Button>
            </div>

        </div>
    );
}