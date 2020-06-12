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

    const [idxPage, setIdxPage] = useState(0); // 0 for quizz form, more for question
    const [quizz, setQuizz] = useState();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagsQuizz, setTagsQuizz] = useState([]);

    const [next, setNext] = useState(); //true if next question exist
    const [isSaved, setIsSaved] = useState(false); //true if data's been saved



    let onSubmitQuizz = (q) => {
        if (quizz && quizz.id_quizz) {
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
        tmp[idxPage - 1] = a;
        setAnswers(tmp);
        setIsSaved(true);
    }

    function sendDatas(event) {
        event.preventDefault();
        if (id_creator) {
            let idkiz;
            let idkestion;
            quizz.id_creator = id_creator;
            apipost.sendQuizz(quizz).then(res => {
                // setIdQuizzCreated(res[0].id_quizz)
                idkiz = res[0].id_quizz;
                let i =0;
                for (const question of questions) {
                    question.id_quizz = idkiz;
                    apipost.sendQuestion(question).then(res => {
                        idkestion = res[0].id_question;
                        for (const answer of answers[i]) {
                            answer.id_question = idkestion;
                            apipost.sendAnswer(answer);
                        }
                        i++;
                    });
                }
            });
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
                <AddQuizz quizz={quizz} tags={tags} tagsQuizz={tagsQuizz} onSubmitQuizz={(q) => onSubmitQuizz(q)} onChange={e => onChange()} />
                : ''}

            {/* form question preset */}
            {idxPage > 0 ?
                <AddQuestion key={idxPage-1} answers={answers && answers[idxPage - 1] ? answers[idxPage - 1] :''} question={questions && questions[idxPage - 1] ? questions[idxPage - 1] : '' } onSubmitQuestion={(q, a) => onSubmitQuestion(q, a)} onChange={e => onChange()} />
                : ''}

            {idxPage > 0 ?
                <button className="waves-effect waves-light btn-large" onClick={event => { setIdxPage(idxPage - 1); setIsSaved(true); }} name="action">
                    <i className="material-icons">navigate_before</i>
                </button>
                : ''}

            {quizz ?
                <button className="waves-effect waves-light btn-large" name="action" onClick={event => { 
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