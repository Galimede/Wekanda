import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { Select, Chip, Icon, TextInput } from 'react-materialize';
import ReactPlayer from 'react-player';
import './css/formQuizz.css';

export default function FormQuizz(props) {

    // Mode ADD
    const { id_user } = useParams();

    // Mode EDIT
    const { id_quizz } = useParams();
    const [quizz, setQuizz] = useState({});
    const [edit, setEdit] = useState(false);
    const [tagsDB, setTagsDB] = useState([]);
    const [tagsChips, setTagsChips] = useState({});
    const [tagsQuizz, setTagsQuizz] = useState([]);
    const [tagsQuizzChips, setTagsQuizzChips] = useState([]);

    async function getQuizz() {
        await axios.get(`http://${config.server}/quizzes/${id_quizz}`)
            .then((res) => {              
                setQuizz(res.data);
            });
    }

    async function getTags() {
        await axios.get(`http://${config.server}/tags/`)
            .then((res) => {
                let dataTag = {};
                let db = [];
                (res.data).forEach(tag => {
                    dataTag[tag.tag] = null;
                    db.push(tag.tag);
                })
                setTagsChips(dataTag);
                setTagsDB(db);
            });
    }

    async function getTagsQuizz() {
        await axios.get(`http://${config.server}/tagsquizzes/${id_quizz}`)
            .then((res) => {   
                let tagQuizz = [];
                let tagQuizzChips = [];
                (res.data).forEach( obj => {
                    tagQuizz.push(obj.tag)
                    tagQuizzChips.push({ tag : obj.tag});
                })
                setTagsQuizz(tagQuizz);
                setTagsQuizzChips(tagQuizzChips);
            });
    }

    async function postTag(req){
        await axios.post(`http://${config.server}/tags/`, req);
    }

    async function postTagQuizz(req){
        await axios.post(`http://${config.server}/tagsquizzes/`, req);
    }

    async function deleteTag(tagname){
        await axios.delete(`http://${config.server}/tagsquizzes/${id_quizz}/${tagname}`);
    }
    

    useEffect(() => {
        getTags();
        if(id_quizz !== undefined){
            setEdit(true);
            getQuizz();
            getTagsQuizz();
        }
    }, [])

    function uniqueName(filename) {
        if(filename){
            const index = filename.indexOf(".");
            const rootFilename = filename.substr(0, index);
            return rootFilename + Date.now() + filename.substr(index);
        }
        else{
            return '';
        }
    }

    function showMedia(q){
        if(q.path_file !== undefined){
            if(q.path_file !== ''){

                let splitType = q.path_file.split('.');
                let type = splitType[splitType.length-1];
    
                if(type === 'mp4'){
                    return (
                        <div id="div-media">
                            <ReactPlayer 
                            id='player' 
                            controls={true}
                            volume={0.5}
                            wrapper='div-media'
                            url={`http://${config.server}/video/${q.path_file}`}
                            />
                        </div>
                    )
                }
                else{
                    return (
                        <div id="div-media">
                            <img src={`http://${config.server}/img/${q.path_file}`} alt={`${q.path_file}`}></img>
                        </div>
                    )
                }
            }
        }
    }

    async function sendResquest(event){
        event.preventDefault();

        let title = event.target.title.value;
        let pathFile = '';
        let file = null;
        let difficulty = event.target.difficulty.value;
        let description = event.target.description.value;

        if(event.target.difficulty.value !== ''){
            difficulty = event.target.difficulty.value;
        }

        if(!edit && title === ''){
            return alert("Entrez un titre 'il vous plait !")
        }

        if(difficulty === '' && !edit){
            return alert("Choississez une difficulté s'il vous plait !")
        }
        
        if(document.getElementById("file").files[0]){
            file = document.getElementById("file").files[0];
            pathFile = uniqueName(file.name);
        }

        // On récupère les tags
        let tagRecup = [];
        (document.getElementById("tags").M_Chips.chipsData).forEach( obj => {
            tagRecup.push(obj.tag);
        })

        let tagAssocieQuizz = [];
        // Si on a récupéré des tags
        if (tagRecup.length > 0) {
            // Pour chaque tag lié au quizz
            tagsQuizz.forEach( tag => {
                // s'il n'est pas dans les tags récupéré, on le délie
                if(tagRecup.includes(tag) === false){
                    deleteTag(tag);
                }
            })
            // pour chaque tag récupéré
            tagRecup.forEach( async tag => {
                // s'il n'est pas dans la db, on l'ajoute à la db
                if(tagsDB.includes(tag) === false){
                    let t = {
                        'tagname' : tag
                    }
                    await postTag(t);
                    // On lie le tag au quizz
                    let req = {
                        'id_quizz' : id_quizz,
                        'tag' : tag
                    }
                    await postTagQuizz(req);
                }
                else{
                    // S'il est déja dans le db et qu'il n'est pas lié au quizz
                    if(tagsQuizz.includes(tag) === false){
                        // on le lie au quizz
                        let req = {
                            'id_quizz' : id_quizz,
                            'tag' : tag
                        }
                        await postTagQuizz(req);
                    }                  
                }
            })
        }
        else{
            if(!edit){
                return alert("Entrez au moins un tag s'il vous plait !");
            }
        }       

        let bodyFormData = new FormData();
        if(!edit){
            bodyFormData.set('id_creator', id_user);
        }
        bodyFormData.set('title', title);
        bodyFormData.set('path_file', pathFile);
        bodyFormData.set('difficulty', difficulty);
        bodyFormData.set('description', description);
        bodyFormData.append('file', file);

        if(edit){
            if(title !== '' && pathFile !== '' && difficulty !== '' && description !== '' && file !== null){
                await axios.patch(`http://${config.server}/quizzes/${id_quizz}`, bodyFormData);
            }
            //window.location.reload();
        }
        else{
            await axios.post(`http://${config.server}/quizzes/`, bodyFormData);
            window.location=`/profile/${id_user}`;
        }
    }
    
    return (
        <div id='form-quizz-container'>

            {edit ? <h3>{quizz.title}</h3> : <h3>Créer votre quizz !</h3>}

            <form onSubmit={event => sendResquest(event)} encType="multipart/form-data">

                <div id="div-title" className="col s12">
                    <div className="input-field inline">
                        <TextInput
                            id="title"
                            label='Title'
                            placeholder={edit ? quizz.title : undefined}
                        />
                    </div>
                </div>

                {edit ? showMedia(quizz)
                    : ''
                }

                <div id="div-file" className="col s12">
                    <div className="input-field inline">
                        <TextInput
                            id="file"
                            label="File"
                            type="file"
                            name="file"
                        />
                    </div>
                </div>

                <div id="div-difficulty" className="col s12">
                    <div className="input-field inline" >
                        <Select defaultValue='' id="difficulty">
                            <option value="" disabled >Choose a difficulty</option>
                            <option value="1">Facile</option>
                            <option value="2">Moyen</option>
                            <option value="3">Difficile</option>
                        </Select>
                    </div>
                </div>

                <div id="div-description" className='col s12'>
                    <div className='input-field inline'>
                        <TextInput
                            data-length={140}
                            id="description"
                            label="Description"
                            placeholder={edit ? quizz.description : undefined}
                        />
                    </div>
                </div>

                <div id="div-tags" className="col s12">
                    <div className="input-field inline">
                        <Chip
                            id="tags"
                            close={false}
                            closeIcon={<Icon className="close">close</Icon>}
                            options={{
                                data: tagsQuizzChips,
                                autocompleteOptions: {
                                    data: tagsChips,
                                    limit: Infinity,
                                    minLength: 3,
                                    onAutocomplete: function noRefCheck() {}
                                },
                                placeholder: 'Enter a tag',
                                secondaryPlaceholder: '+Tag'
                            }}
                        />
                    </div>
                </div>

                <div id="div-confirmer" className="col s12">
                    <button className="waves-effect waves-light btn-large" type="submit" name="action">Confirmer</button>
                </div>

            </form>

            {edit ?
                <div id="div-questions">
                    <a href={`/questions/${id_quizz}/edit`} className="waves-effect waves-light btn-large">Modifier les questions</a>
                </div>
                : false
            }

        </div>
    );
}