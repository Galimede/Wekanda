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

    function onSubmit(e) {
        e.preventDefault();
        let question = {
            question: e.target.question.value,
            path_file: e.target.path_file.value,
            id_quizz: props.question && props.question.id_quizz ? props.question.id_quizz : '',
            id_question: props.question && props.question.id_question ? props.question.id_question : ''
        }
        let answers = [];
        if(e.target.answer0.value != ''){
            answers.push({ answer: e.target.answer0.value, correct: e.target.correct0.value, path_file: e.target.path_file0.value, id_question: props.question && props.question.id_question ? props.question.id_question : '' })
        }
        if(e.target.answer1.value != ''){
            answers.push({ answer: e.target.answer1.value, correct: e.target.correct1.value, path_file: e.target.path_file1.value, id_question: props.question && props.question.id_question ? props.question.id_question : '' });
        }
        if(e.target.answer2.value != ''){
            answers.push({ answer: e.target.answer2.value, correct: e.target.correct2.value, path_file: e.target.path_file2.value, id_question: props.question && props.question.id_question ? props.question.id_question : '' });
        }
        if(e.target.answer3.value != ''){
            answers.push({ answer: e.target.answer3.value, correct: e.target.correct3.value, path_file: e.target.path_file3.value, id_question: props.question && props.question.id_question ? props.question.id_question : '' });
        }
        // console.log('question :')
        // console.log(question)
        // console.log('answers : ')
        // console.log(answers)
        props.onSubmitQuestion(question, answers);
    }

    useEffect(() => {

    }, [])



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
                    <input id='question' onChange={e => { props.onChange() }} defaultValue={props.question ? props.question.question : ''} placeholder={'Quelle est la difference entre un hibou et une corde ?'} type="text" className="validate itest" />
                    {props.question && props.question.path_file && props.question.path_file.includes('.jpg') ? <img src={props.question.path_file} /> : ''}
                    {props.question && props.question.path_file && props.question.path_file.includes('.mp4') ? <ReactPlayer
                        id='player'
                        controls={true}
                        volume={0.5}
                        wrapper='question'
                        url={`http://${config.server}/video/${props.question.path_file}`} /> : ''}
                </div>

                <div className="input-field inline">
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>File</span>
                            <input id='path_file' type='file' />
                        </div>
                        <div className="file-path-wrapper">
                            <input onChange={e => { props.onChange() }} id="fileName" className="file-path validate" type="text" defaultValue={props.question && props.question.path_file ? props.question.path_file : ''} />
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