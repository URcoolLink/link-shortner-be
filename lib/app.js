const express = require('express');
const app = express();
const { getRandomWord } = require('./utils/getRandomWord');

const Link = require('./model/link.js');

app.use(express.json());

// POST route
app.post('/api/v1/links', async(req, res, next) => {
  try {
    const word = await getRandomWord();
    console.log(word);
    const addedLink = await Link.insert(req.body, word);
    res.send(addedLink);
  } catch(error) {
    next(error);
  }
});

// GET findUrlByCool link shortener redirect
app.get('/:cool', async(req, res, next) => {
  try {
    const url = await Link.findUrlByCool(req.params.cool);
    res.redirect(url);
    
  } catch(error) {
    next(error);
  }
});

app.patch('/api/v1/links/:id', async(req, res, next) => {
  try {
    const word = await getRandomWord()
    const updatedCool = await Link.updateCool(req.params.id, word);
    res.send(updatedCool);
    
  } catch(error) {
      next(error);
    }
});


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
