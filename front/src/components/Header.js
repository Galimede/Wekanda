import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import './css/header.css';
import 'materialize-css';
import config from '../config';
import axios from "axios";
import { Dropdown, Icon, Navbar } from 'react-materialize';

export default function Header() {

    const [tags, setTags] = useState([]);

    async function getTags() {
        await axios.get(`http://${config.server}/tags`)
            .then(res => {
                setTags(res.data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getTags();
    }, []);

    function renderTagsOption() {
        return tags.map(function (t, index){
            return (<Link key={index} to={`/quizzes/${t.tag}`}>{t.tag}</Link>)
        });
    }

    return (
        <div className="header">
            <nav>
                <div className="nav-wrapper grey darken-4">

                    <a href="/home" className="brand-logo center">Wekanda</a>

                    <ul className="right hide-on-med-and-down">
                        <li>
                            <form>
                                <Navbar
                                    alignLinks="right"
                                    className="grey darken-4"
                                    id="mobile-nav"
                                    menuIcon={<Icon>menu</Icon>}
                                    search
                                />
                            </form>
                        </li>
                        <li>
                            <Dropdown
                                id="dropdown-filter"
                                options={{
                                    alignment: 'right',
                                    inDuration: 150,
                                    outDuration: 250
                                }}
                                trigger={<a node="button"><Icon>tune</Icon></a>}
                            >
                            {renderTagsOption()}
                            </Dropdown>
                        </li>

                        <li><a href="#"><Icon>person_outline</Icon></a></li>
                    </ul>
                </div>
            </nav>

        </div>
    );
}
