import React, { useEffect, useState } from 'react';
import './css/answerfield.css';

export default function AnswerField(props) {

    const [answer, setAnswer] = useState({
        answer: '',
        correct: false,
        path_file: '',
    });
    const [a, setA] = useState('')

    function handleAnswerField(e) {
        let value = e.target.value;
        setA(value);
        props.onChange();
    }

    useEffect(() => {
        if (props.answer) {
            let ans={
                answer: props.answer.answer,
                correct: props.answer.correct,
                path_file: props.answer.path_file
            }
            setAnswer(ans);
            setA(props.answer.answer);
        } else {
            setAnswer({
                answer: '',
                correct: false,
                path_file: '',
            })
        }
    }, [])

    useEffect(() => {
    }, [answer.answer, a])
    return (
        <>
            <input onChange={e => { handleAnswerField(e) }}
                value={a}
                placeholder={props.placeholder ? props.placeholder : ''}
                type="text" className="validate itest" class='answerfield' id={props.id ? 'answer' + props.id : ''} />
            <div className="input-field inline">
                <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input id={'file' + props.id} type="file" onChange={e => { props.onChange() }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input onChange={e => { props.onChange() }} id={props.id ? 'path_file' + props.id : ''} className="file-path validate" type="text" defaultValue={props.answer ? props.answer.path_file : ''} />
                    </div>
                </div>
            </div>
            <label>
                <input id={'correct' + props.id} type='checkbox' onChange={e => { props.onChange() }} defaultChecked={props.answer && props.answer.correct ? props.answer.correct : false } />
                <span>correct</span>
            </label>
        </>
    );
}