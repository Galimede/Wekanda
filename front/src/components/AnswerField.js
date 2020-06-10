import React, {useEffect, useState} from 'react';

export default function AnswerField(props) {

    const [answer, setAnswer] = useState({
        answer: '',
        correct: false,
        path_file: '',
    });
    const [a, setA] = useState('')


    function handleAnswerField(e){
        let value = e.target.value;
        setA(value);
        props.onChange();
    }

    useEffect(()=>{
        if(props.answer){
            setAnswer(props.answer);
            setA(props.answer.answer);
        }else{
            setAnswer({
                answer: '',
                correct: false,
                path_file: '',
            })
        }
    }, [])

    useEffect(()=>{
        // if(answer){console.log('change answer')
        // console.log(answer)}
    },[answer.answer, a])
    return (
        <>
            <input onChange={e => { handleAnswerField(e) }}
                value={a}
                placeholder={props.placeholder ? props.placeholder : ''}
                type="text" className="validate itest" id={props.id ? 'answer'+props.id : ''} />

            <input id={'correct'+props.id} type='checkbox' onChange={e => { props.onChange() }} checked={answer.correct == true ? true : false}/>

            <div className="input-field inline">
                <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input id={'file'+props.id} type="file" onChange={e => { props.onChange() }}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input onChange={e => { props.onChange() }} id={props.id ? 'path_file'+props.id : ''} className="file-path validate" type="text" defaultValue={props.answer ? props.answer.path_file : ''} />
                    </div>
                </div>
            </div>
        </>
    );
}