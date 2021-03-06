const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
router
    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM tagQuizz');
            res.json(result.rows);
            res.status(200);
        })

    .get('/:id_quizz',
        async (req, res) => {
            const result = await pool.query('SELECT tag FROM tagQuizz WHERE id_quizz=$1', [req.params.id_quizz]);
            res.json(result.rows);
            res.status(200);
        })

    .post("/",
        async (req, res) => {
            const result = await pool.query("INSERT INTO tagQuizz(id_quizz, tag) values($1,$2)", [req.body.id_quizz, req.body.tag]);
            res.status(201).end();
        })
    .delete('/:tag/:id', async (req, res)=>{
        console.log(req.params)
        await pool.query(
            `DELETE FROM tagquizz WHERE tag=$1 AND id_quizz=$2`, [req.params.tag, req.params.id]);
        res.status(204)
    });

module.exports = router;