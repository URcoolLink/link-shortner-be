const fetch = require('node-fetch');
async function getRandomWord() {
  const word = await fetch('https://random-word-api.herokuapp.com/word?number=1')
    .then(response => response.json())
    .then(data => { return data; });

  return word;
}

module.exports = { getRandomWord };

