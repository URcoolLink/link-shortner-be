const express = require('express');
const app = express();
const fetch = require('node-fetch');

const Link = require('./model/link.js');

app.use(express.json());

// POST route
app.post('/api/v1/links', async(req, res, next) => {
  try {
    const word = await fetch('https://random-word-api.herokuapp.com/word?number=1')
      .then(response => response.json())
      .then(data => { return data; });

    const addedLink = await Link.insert(req.body, word);
    res.send(addedLink);
  } catch(error) {
    next(error);
  }
});

// GET findIdByCool link shortener redirect
app.get('/:cool', async(req, res, next) => {
  try {
    const url = await Link.findIdByCool(req.params.cool);
    res.redirect(url);
    
  } catch(error) {
    next(error);
  }
});


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
