import React, { useState, useEffect, useRef } from 'react';
import { Select, Chip, Icon } from 'react-materialize';
import './css/addQuizz.css';
import * as apipatch from '../APIcalls/APIpatch';

export default function AddQuizz(props) {
    
    const [charsLeft, setCharsLeft] = useState(140);
    const [tags, setTags] = useState({}); //for autocompletion
    const [tagsQuizz, setTagsQuizz] = useState([]);

    function usePrevious(val){
        const ref = useRef();

        useEffect(()=>{
            ref.current =val;
        },[val]);

        return ref.current;
    }

    const prevTQ = usePrevious(tagsQuizz);

    function onSubmit(e) {
        e.preventDefault();
        let res = {
            title: e.target.title.value,
            difficulty: e.target.difficulty.value,
            path_file: e.target.fileName.value,      
            description: e.target.description.value
        };
        if (e.target.file.files[0]){
            res.file = e.target.file.files[0];
        }
        props.onSubmitQuizz(res, tagsQuizz);
        
    }

    function handleCounter(e) {
        /* Update le compteur de caracteres */
        const charCount = e.target.value.length;
        const tmpLeft = 140 - charCount;
        if (tmpLeft === 0) {

        }
        setCharsLeft(tmpLeft);
        props.onChange();
    };

    useEffect(() => { 
        
     }, [charsLeft, tags, tagsQuizz]);
    
    // useEffect(()=>{
    //     console.log('tq changé')
    //     if (tagsQuizz){
    //         console.log(tagsQuizz);
    //         // console.log(prevTQ);
    //     }
    // },[tagsQuizz])

    useEffect(()=>{
        if(props.tags){
            let t ={};
            for (let [key, tag] of Object.entries(props.tags)){
                t[`${tag.tag}`] = 'null';
            }
            setTags(t);
        }
        if(props.tagsQuizz){
            let tq = [];
            for(let [key, tagQuizz] of Object.entries(props.tagsQuizz)){
                tq.push({
                    tag: `${tagQuizz.tag}`
                });
            }
            setTagsQuizz(tq);
        }
    }, [props])
    
    return (
        <div id='add-quizz-container'>

            <form onSubmit={event => {
                onSubmit(event);
            }} encType="multipart/form-data">

                <div className="col s12">
                    <button className="waves-effect waves-light btn-large"
                        type="submit">
                        <i className="material-icons">save</i>
                    </button>
                </div>

                <div id="div-title" className="col s12">
                    <div className="input-field inline">
                        <label htmlFor='title'>Title</label>
                        <input style={{ fontSize: '22px' }} onChange={e => { props.onChange() }} id="title" type="text" className="validate" defaultValue={props.quizz ? props.quizz.title : ''} placeholder={'Example'} />
                    </div>
                </div>

                <div className="col s12">
                    <div className="input-field inline">
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>File</span>
                                <input id="file" type="file" onChange={e => { props.onChange() }} />
                            </div>
                            <div className="file-path-wrapper">
                                <input onChange={e => { props.onChange() }} id="fileName" className="file-path validate" type="text" defaultValue={props.quizz ? props.quizz.path_file : ''} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12">
                    <div className="input-field inline" >
                        <label id="label-diff" htmlFor='difficulty'>Difficulty</label>
                        <Select onChange={e => {props.onChange();}} id="difficulty" value={props.quizz ? props.quizz.difficulty : ''}>
                            <option value='' disabled>Choose a difficulty</option>
                            <option value={1} >Facile</option>
                            <option value={2} >Moyen</option>
                            <option value={3} >Difficile</option>
                        </Select>
                    </div>
                </div>

                <div className='col s12'>
                    <div className='input-field inline'>
                        <textarea id="description"
                            defaultValue={props.quizz ? props.quizz.description : ''}
                            className="materialize-textarea"
                            maxLength='140'
                            onChange={e => { handleCounter(e) }}
                            placeholder={props.quizz ? '' : 'My Quizz is super duper teachful!'}

                        />
                        <label htmlFor='description'>Description</label>
                        <p id='charCounter'>{charsLeft}</p>
                    </div>
                </div>


                <div id="div-tags" className="col s12">
                    <div className="input-field inline">
                        <Chip
                            id="tags"
                            close={false}
                            closeIcon={<Icon className="close">close</Icon>}
                            options={{
                                onChipAdd: (chip)=>{
                                    setTagsQuizz(chip[0].M_Chips.chipsData)
                                },
                                onChipDelete: (chip)=>{
                                    if(props.quizz){
                                        for(let tq of prevTQ){
                                            let filt = tagsQuizz.filter(tag => tq.tag == tag.tag);
                                            if(filt.length === 0){
                                                apipatch.deleteTagQuizz(tq.tag, props.quizz.id_quizz)
                                            }
                                        }
    
                                    }
                                },
                                data: tagsQuizz,
                                autocompleteOptions: {
                                    data: tags,
                                    limit: 3,
                                    minLength: 3,
                                    onAutocomplete: function noRefCheck() { }
                                }
                            }}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}