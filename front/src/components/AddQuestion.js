import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

import AnserField from './AnswerField';

import config from '../config';
import './css/addQuestion.css';
import AnswerField from './AnswerField';

export default function AddQuestion(props) {
    // const [answer0, setAnswer0] = useState({})
    // const [answer1, setAnswer1] = useState({})
    // const [answer2, setAnswer2] = useState({})
    // const [answer3, setAnswer3] = useState({})

    const [answers, setAnswers] = useState([]);
    const [question, setQuestion] = useState({});

    function onSubmit(e) {
        e.preventDefault();
        let t = e.target;
        let q = {
            question: t.question.value,
            path_file: t.path_file.value,
            id_quizz: question && question.id_quizz ? question.id_quizz : '',
            id_question: question && question.id_question ? question.id_question : '',
            file: t.file.files[0] ? t.file.files[0] : ''
        }
        let a = [];
        if(t.answer0.value != '' ||  t.path_file0.value != ''){
            a.push({ 
                answer: t.answer0.value, 
                correct: t.correct0.checked, 
                path_file: t.path_file0.value, 
                id_answer: answers && answers[0] ? answers[0].id_answer : '',
                id_question: question && question.id_question ? question.id_question : '',
                file: t.file0.files[0] ?  t.file0.files[0] : ''
            })
        }
        if(t.answer1.value != '' ||  t.path_file1.value != ''){
            a.push({ 
                answer: t.answer1.value, 
                correct: t.correct1.checked, 
                path_file: t.path_file1.value, 
                id_answer: answers && answers[1] ? answers[1].id_answer : '',
                id_question: question && question.id_question ? question.id_question : '',
                file: t.file1.files[0] ?  t.file1.files[0] : ''
            });
        }
        if(t.answer2.value != '' ||  t.path_file2.value != ''){
            a.push({ 
                answer: t.answer2.value, 
                correct: t.correct2.checked, 
                path_file: t.path_file2.value, 
                id_answer: answers && answers[2] ? answers[2].id_answer : '',
                id_question: question && question.id_question ? question.id_question : '',
                file: t.file2.files[0] ?  t.file2.files[0] : ''
            });
        }
        if(t.answer3.value != '' ||  t.path_file3.value != ''){
            a.push({ 
                answer: t.answer3.value, 
                correct: t.correct3.checked, 
                path_file: t.path_file3.value, 
                id_answer: answers && answers[3] ? answers[3].id_answer : '',
                id_question: question && question.id_question ? question.id_question : '',
                file: t.file3.files[0] ?  t.file3.files[0] : ''
            });
        }
        props.onSubmitQuestion(q, a);
    }

    useEffect(() => {
        if(props.question){
            setQuestion(props.question);
        }
        if(props.answers){
            setAnswers(props.answers);
        }
    }, [props.question, props.answers])

    useEffect(()=>{

    },[question,answers]);

    return (
        <div id="add-questions-container">

            <form onSubmit={e => onSubmit(e)} encType="multipart/form-data">
                <div className="col s12">
                    <button className="waves-effect waves-light btn-large" type="submit">
                        <i className="material-icons">save</i>
                    </button>
                </div>

                <div className="col s12">
                    <label htmlFor='question'>Question</label>
                    <input id='question' onChange={e => { props.onChange() }} defaultValue={question ? question.question : ''} placeholder={'Quelle est la difference entre un hibou et une corde ?'} type="text" className="validate itest" />
                    {question && question.path_file && (question.path_file.includes('.jpeg') || question.path_file.includes('.jpg')) ? <img src={`http://${config.server}/img/${question.path_file}`} /> : ''}
                    {question && question.path_file && question.path_file.includes('.mp4') ? <ReactPlayer
                        id='player'
                        controls={true}
                        volume={0.5}
                        wrapper='question'
                        url={`http://${config.server}/video/${question.path_file}`} /> : ''}
                </div>

                <div className="input-field inline">
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>File</span>
                            <input onChange={e => { props.onChange() }} id='file' type='file' />
                        </div>
                        <div className="file-path-wrapper">
                            <input onChange={e => { props.onChange() }} id="path_file" className="file-path validate" type="text" defaultValue={question && question.path_file ? question.path_file : ''} />
                        </div>
                    </div>
                </div>

                <div className="col s12">
                    <label htmlFor='answer0'>Answer 1</label>
                    <AnswerField answer={props.answers && props.answers[0] ? props.answers[0] : ''} onChange={e => { props.onChange() }} placeholder='Reponse A' id='0' />
                </div>

                <div className="col s12">
                    <label htmlFor='answer1'>Answer 2</label>
                    <AnswerField answer={props.answers && props.answers[1] ? props.answers[1] : ''} onChange={e => { props.onChange() }} placeholder='Reponse B' id='1' />
                </div>

                <div className="col s12">
                    <label htmlFor='answer2'>Answer 3</label>
                    <AnswerField answer={props.answers && props.answers[2] ? props.answers[2] : ''} onChange={e => { props.onChange() }} placeholder='Reponse C' id='2' />
                </div>

                <div className="col s12">
                    <label htmlFor='answer3'>Answer 4</label>
                    <AnswerField answer={props.answers && props.answers[3] ? props.answers[3] : ''} onChange={e => { props.onChange() }} placeholder='Reponse D' id='3' />
                </div>


            </form>

        </div>
    );
}