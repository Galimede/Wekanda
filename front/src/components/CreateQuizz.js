import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as apipost from '../APIcalls/APIpost';
import * as apiget from '../APIcalls/APIget';
import * as apipatch from '../APIcalls/APIpatch';
import { useHistory } from "react-router-dom";
import AddQuizz from './AddQuizz';
import AddQuestion from './AddQuestion';
import axios from "axios";
import config from "../config";
import './css/createquizz.css';
import { useCookies } from 'react-cookie';


export default function CreateQuizz() {

    const { id_quizz } = useParams();

    const history = useHistory();

    const [idxPage, setIdxPage] = useState(0); // ==0 for quizz form, >0 for question form
    const [quizz, setQuizz] = useState();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagsQuizz, setTagsQuizz] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['login']);

    const [user,setUser] = useState(undefined);

    const [next, setNext] = useState(); //true if next question exist
    const [isSaved, setIsSaved] = useState(false); //true if data's been saved
    // const [sent, setSent] = useState(false);


    async function fetchUser() {
        if (cookies.login) {
            const res = await axios.get(`http://${config.server}/users/profile`)
                .then(res => {
                    setUser(res.data);
                    return true;
                })
                .catch(err => false);
            if (!res) {
                setUser('not found');
                alert("Votre session a expirée");
                removeCookie('login');
                history.push('/signin')
            }
        } else {
            alert("Vous n'êtes pas connecté");
            history.push('/signin');
        }
    }

    let onSubmitQuizz = (q, tq) => {
        if (quizz && quizz.id_quizz) {
            q.id_quizz = quizz.id_quizz;
        }
        console.log(tq)
        setTagsQuizz(tq)
        setQuizz(q);
        setIsSaved(true);
    }
    function onSubmitQuestion(q, a) {
        let tmp = questions;
        tmp[idxPage - 1] = q;
        setQuestions(tmp);
        tmp = answers;
        tmp[idxPage - 1] = a;
        setAnswers(tmp);
        setIsSaved(true);
    }

    function sendDatas(event) {
        console.log(questions)
        console.log(answers)
        console.log(tagsQuizz)
        event.preventDefault();
        let idquizz;
        let idquestion;
        if (id_quizz) {
            apipatch.updateQuizz(quizz);
            for (const [i, question] of questions.entries()) {
                if (question.id_quizz) {
                    console.log('ca upda')
                    apipatch.updateQuestion(question).then(()=>{
                        for (const answer of answers[i]) {
                            if (answer.id_question) {
                                apipatch.updateAnswer(answer);
                            } else {
                                apipost.sendAnswer(answer);
                            }
                        }
                        console.log(i)
                    });
                } else {
                    console.log('ca send')
                    question.id_quizz = id_quizz;
                    console.log(question)
                    console.log(answers[i])
                    apipost.sendQuestion(question).then(res=>{
                        idquestion = res[0].id_question;
                        for (const answer of answers[i]) {
                            answer.id_question = idquestion;
                            apipost.sendAnswer(answer);
                        }
                        console.log(i)

                    });
                }
            }

            for (const tagQuizz of tagsQuizz) {
                // console.log(tagQuizz.tag)
                if(!tags.some(val => val.tag === tagQuizz.tag)){
                    apipost.sendNewTag(tagQuizz.tag).then(()=>{
                        apipost.sendTagQuizz(tagQuizz.tag, id_quizz)
                    })
                }else{
                    apipost.sendTagQuizz(tagQuizz.tag, id_quizz)
                    // .then(setSent(true))
                }
            }
        } else {
            quizz.id_creator = user.id_user;
            console.log('id_creator',quizz.id_creator,'iid_user',user.id_user);
            apipost.sendQuizz(quizz).then(res => {  
                idquizz = res[0].id_quizz;
                let i =0;
                for (const question of questions) {
                    question.id_quizz = idquizz;
                    apipost.sendQuestion(question).then(res => {
                        idquestion = res[0].id_question;
                        for (const answer of answers[i]) {
                            answer.id_question = idquestion;
                            apipost.sendAnswer(answer);
                        }
                        i++;
                    });
                }
            });
            for (const tagQuizz of tagsQuizz) {
                console.log(tagQuizz.tag)
                if(!tags.some(val => val.tag === tagQuizz.tag)){
                    apipost.sendNewTag(tagQuizz.tag).then(()=>{
                        apipost.sendTagQuizz(tagQuizz.tag, idquizz)
                    })
                }else{
                    apipost.sendTagQuizz(tagQuizz.tag, idquizz)
                }
            }
            // ;
        } 
    }

    function onChange() {
        setIsSaved(false);
        console.log('form changed')
    }

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = (cookies.login ? 'Bearer ' + cookies.login.token : null);
        fetchUser();
        if (id_quizz) {
            apiget.fetchQuizz(id_quizz).then(res => { setQuizz(res); });
            apiget.fetchQuestionsOfQuizz(id_quizz).then(res => {
                setQuestions(res);
                let i = 0;
                let tmp = [];
                for (const question of res) {
                    tmp = answers;
                    apiget.fetchAnswersOfQuestion(question.id_question).then(result => {
                        tmp[i] = result;
                        setAnswers(tmp);
                        i++;
                    });
                    
                }
            });

            apiget.fetchTagsOfQuizz(id_quizz).then(res => {
                setTagsQuizz(res);
            });
            setIsSaved(true);
        }
        apiget.fetchAllTags().then(res => setTags(res));
    }, []);
    useEffect(() => {
        if (questions) {
            setNext(questions[idxPage] !== undefined);
        }

    }, [idxPage, questions]);

    useEffect(() => {}, [quizz, isSaved, next, answers]);

    useEffect(()=>{
    }, [tags, tagsQuizz])

    // useEffect(()=>{
    //     if(sent){
    //         id_creator ? window.location = `/profile/${id_creator}`: window.location = `/`;
    //     }
    // },[sent])

    return (
        <div id='createQuizz-container'>

            {isSaved ? <p id='saved'>sauvegardé</p> : <p id='saved'>non sauvegardé</p>}

            {idxPage > 0 ? <p>Question {idxPage}</p> : <p>Quizz</p>}

            {/* form quizz vierge */}
            {idxPage === 0 && typeof quizz === {} ?
                <AddQuizz onSubmitQuizz={(q, tq) => onSubmitQuizz(q, tq)} onChange={e => onChange()} />
                : ''}

            {/* form quizz preset */}
            {idxPage === 0 && typeof quizz !== {} ?
                <AddQuizz quizz={quizz} tags={tags} tagsQuizz={tagsQuizz} onSubmitQuizz={(q, tq) => onSubmitQuizz(q, tq)} onChange={e => onChange()} />
                : ''}

            {/* form question preset */}
            {idxPage > 0 ?
                <AddQuestion key={idxPage-1} answers={answers && answers[idxPage - 1] ? answers[idxPage - 1] :''} question={questions && questions[idxPage - 1] ? questions[idxPage - 1] : '' } onSubmitQuestion={(q, a) => onSubmitQuestion(q, a)} onChange={e => onChange()} />
                : ''}

            {idxPage > 0 ?
                <button id='button_prev' className="waves-effect waves-light btn-large" onClick={event => { setIdxPage(idxPage - 1); setIsSaved(true); }} name="action">
                    <i className="material-icons">navigate_before</i>
                </button>
                : ''}

            {quizz ?
                <button id='button_next' className="waves-effect waves-light btn-large" name="action" onClick={event => { 
                        setIdxPage(idxPage + 1); 
                        setIsSaved(true); 
                    }}>
                    <i className="material-icons">
                        {next === true ? 'navigate_next' : 'add'}
                    </i>
                </button>
                : ''}

            {questions && quizz && Object.keys(questions).length > 0 && Object.keys(quizz).length > 0 ?
                <button className="waves-effect waves-light btn-large" type="submit" onClick={e => { sendDatas(e) }}>
                    <i className="material-icons">done</i>
                </button>
                : ''}
        </div>
    );
}