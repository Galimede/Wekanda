const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const router_answers = require('./routes/answers');
const router_quizzes = require('./routes/quizz');
const router_questions = require('./routes/questions');
const router_users = require('./routes/users');
const router_scores = require('./routes/score');
const router_tags_quizzes = require('./routes/tag_quizz');
const router_tags = require('./routes/tags');

const pool = require('./data/pg');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;

// Extends : https://swagger.io/specification/#infoObject
const options = {
    swaggerDefinition : {
        info: {
            title: 'Wekanda Quizz API',
            version: '0.1',
            description: 'Wekanda Quizz API documentation'
        },
    },
    apis: ['./routes/answers.js'],
};
const specs = swaggerJsDoc(options);


app
    .use(morgan('combined'))
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use('/quizzes', router_quizzes)
    .use('/questions', router_questions)
    .use('/answers', router_answers)
    .use('/users', router_users)
    .use('/scores', router_scores)
    .use('/tagsquizzes', router_tags_quizzes)
    .use('/tags', router_tags)
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
    .use(express.static(__dirname + '/public'))
    .get('/', (req, res) => res.send({ message: 'Welcome to Wekenda Quizz API' }))
    .get('/test_db', async (req, res) => {
       const result = await pool.query('SELECT NOW()');
       res.send(result.rows);
    });

app.listen(port, () => console.log('Wekanda QUIZZ API server listening on port ' + port));
