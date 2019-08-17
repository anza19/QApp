//import dependencies
//Everything starts with 5 require statements
//These statements load all libraries you installed with NPM
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//define the Express app
//We use Express to define a new app
const app = express();

//the database
//This array will act as our database
const questions = [];

//Next we call the use method of our Express app four times
//Each one is used to configure a different library
//enhance your app security with Helmet
app.use(helmet());

//use bodyParser to parse application/json content-type
app.use(bodyParser.json());

//enable all CORS requests
app.use(cors());

//log HTTP requests
app.use(morgan('combined'));

//retrieve all questions
//map simply creates a new array but each element goes through a function
//Here we define our first endpoint
//This endpoint is responsible for sending the list of questions back to whoever requests it.
//The only thing to notice here is that instead of sending the answers as well, this endpoint compiles them
//and sends the number of answers each question has
app.get('/', (req, res) => {
    const qs = questions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answers:q.answers.length,
    }));
    res.send(qs);
})

//get a specific question
//This is another endpoint
//This new endpoint is responsible for responding to requests with a single question
app.get('/:id', (req, res) => {
    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if(question.length > 1) return res.status(500).send();
    if(question.length === 0) return res.status(404).send();
    res.send(question[0]);
});

//insert a new question
//This our third endpoint
//This will be activated whenever someone sends a POST HTTP request to your API
//Goal here is to take the message sent in the body of the request to insert a newquestion in your database
app.post('/', (req, res) => {
  const {title, description} = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: [],
  };
  questions.push(newQuestion);
  res.status(200).send();
});

// insert a new answer to a question
app.post('/answer/:id', (req, res) => {
  const {answer} = req.body;

  const question = questions.filter(q => (q.id === parseInt(req.params.id)));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();

  question[0].answers.push({
    answer,
  });

  res.status(200).send();
});

// start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});