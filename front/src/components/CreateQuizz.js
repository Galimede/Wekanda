import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as apipost from '../APIcalls/APIpost';
import * as apiget from '../APIcalls/APIget';
import * as apipatch from '../APIcalls/APIpatch';

import AddQuizz from './AddQuizz';
import AddQuestion from './AddQuestion';

export default function CreateQuizz() {

    const { id_user } = useParams();
    const { id_quizz } = useParams();
    const id_creator = id_user;

    const [idxPage, setIdxPage] = useState(0);
    const [quizz, setQuizz] = useState();
    const [questions, setQuestions] = useState([]);
    const [idQuizzCreated, setIdQuizzCreated] = useState();
    const [answers, setAnswers] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagsQuizz, setTagsQuizz] = useState([]);
    const [next, setNext] = useState();


    let onSubmitQuizz = (q) => {
        if (quizz.id_quizz) {
            q.id_quizz = quizz.id_quizz;
        }
        setQuizz(q);
        setIsSaved(true);
    }
    function onSubmitQuestion(q, a) {
        let tmp = questions;
        tmp[idxPage - 1] = q;
        setQuestions(tmp);
        tmp = answers;
        // console.log(a)
        tmp[idxPage - 1] = a;
        setAnswers(tmp);
        // console.log(a)
        setIsSaved(true);
    }

    function sendDatas(event) {
        event.preventDefault();
        if (id_creator) {
            quizz.id_creator = id_creator;
            setIdQuizzCreated(apipost.sendQuizz(quizz));

            for (const question of questions) {
                question.id_quizz = idQuizzCreated;
                apipost.sendQuestion(question);
            }

            // for (const answer of answers) {
            // answer.id_question = 
            //     apipost.sendAnswer(answer);
            // }

        } else {
            apipatch.updateQuizz(quizz);
            for (const question of questions) {
                if (question.id_quizz) {
                    apipatch.updateQuestion(question);
                } else {
                    apipost.sendQuestion(question);
                }
            }

            for (const a of answers) {
                for (const answer of a){
                    if (answer.id_question) {
                        console.log('on patch answer')
                        apipatch.updateAnswer(answer);
                    } else {
                        console.log('on post answer')
                        apipost.sendAnswer(answer);
                    }
                }
            }
        }

        // for (const tagQuizz of tagsQuizz) {
        //     apipost.sendTagQuizz(tagQuizz.tag, idQuizzCreated)
        //     if(!tags.contains(tagsQuizz.tag)){
        //         apipost.sendNewTag(tagsQuizz.tag)
        //     }
        // }

        // id_creator ? window.location = `/profile/${id_creator}` : window.location = `/`;
    }

    function onChange() {
        setIsSaved(false);
        console.log('form changed')
    }

    useEffect(() => {
        if (id_quizz) {
            apiget.fetchQuizz(id_quizz).then(res => { setQuizz(res); });
            apiget.fetchQuestionsOfQuizz(id_quizz).then(res => {
                setQuestions(res);
                // console.log(res);
                // console.log('a')
                for (const question of res) {
                    // console.log('b')
                    let tmp = answers;
                    // console.log(tmp)

                    apiget.fetchAnswersOfQuestion(question.id_question).then(result => {
                        tmp.push(result)
                        setAnswers(tmp)

                    });
                }
            });

            // apiget.fetchTagsOfQuizz(id_quizz).then(res => {
            //     setTagsQuizz(res);
            // });
            setIsSaved(true);
        }
        // apiget.fetchAllTags().then(res => setTags(res));
    }, []);
    useEffect(() => {
        if (questions) {
            setNext(questions[idxPage] !== undefined);
        }

    }, [idxPage, questions]);

    useEffect(() => {
        if(quizz){
            // console.log(quizz)
        }
    }, [quizz, isSaved, next])

    useEffect(()=>{
        if(answers && idxPage>0){
            // console.log(answers[idxPage-1])
        }
    }, [idxPage])
    return (
        <div id='createQuizz-container'>

            {isSaved ? <p id='saved'>sauvegardé</p> : <p id='saved'>non sauvegardé</p>}

            {idxPage > 0 ? <p>Question {idxPage}</p> : <p>Quizz</p>}

            {/* form quizz vierge */}
            {idxPage === 0 && typeof quizz === {} ?
                <AddQuizz onSubmitQuizz={(q) => onSubmitQuizz(q)} onChange={e => onChange()} />
                : ''}

            {/* form quizz preset */}
            {idxPage === 0 && typeof quizz !== {} ?
                <AddQuizz quizz={quizz} onSubmitQuizz={(q) => onSubmitQuizz(q)} onChange={e => onChange()} />
                : ''}

            {/* form question preset */}
            {idxPage > 0 && typeof questions[idxPage - 1] !== undefined ?
                <AddQuestion answers={answers[idxPage - 1]} question={questions[idxPage - 1]} onSubmitQuestion={(q, a) => onSubmitQuestion(q, a)} onChange={e => onChange()} />
                : ''}

            {/* form question vierge  */}
            {idxPage > 0 && typeof questions[idxPage - 1] === undefined ?
                <AddQuestion onSubmitQuestion={(q, a) => onSubmitQuestion(q, a)} onChange={e => onChange()} />
                : ''}

            {idxPage > 0 ?
                <button className="waves-effect waves-light btn-large" onClick={event => { setIdxPage(idxPage - 1); setIsSaved(true); }} name="action">
                    <i className="material-icons">navigate_before</i>
                </button>
                : ''}

            {quizz ?
                <button className="waves-effect waves-light btn-large" name="action" onClick={event => { setIdxPage(idxPage + 1); setIsSaved(true); }}>
                    <i className="material-icons">
                        {next === true ? 'navigate_next' : 'add'}
                    </i>
                </button>
                : ''}

            {questions ?
                <button className="waves-effect waves-light btn-large" type="submit" onClick={e => { sendDatas(e) }}>
                    <i className="material-icons">done</i>
                </button>
                : ''}
        </div>
    );
}