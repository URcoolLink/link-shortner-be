const fs = require('fs');
const pool = require('../utils/pool.js');
const Link = require('./link');

describe('Link model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new link into the database', async() => {
    const createdLink = await Link.insert({
      url: 'https://inspirobot.me/',
    }, ['apple']);

    const { rows } = await pool.query(
      'SELECT * FROM links WHERE id = $1',
      [createdLink.id]
    );

    expect(rows[0]).toEqual(createdLink);
  });

  it('find url by id', async() => {
    const createdLink = await Link.insert({
      url: 'https://inspirobot.me/'
    }, ['apple']);

    const foundLink = await Link.findById(createdLink.id);

    expect(foundLink).toEqual({
      id: createdLink.id,
      url: 'https://inspirobot.me/',
      cool: 'apple'
    });
  });

  it('return id by cool', async() => {
    const createdLink = await Link.insert({
      url: 'https://inspirobot.me/'
    }, ['apple']);

    const foundLink = await Link.findUrlByCool(createdLink.cool);

    expect(foundLink).toEqual(createdLink.url);
  });

  it('returns null if cant find link by id', async() => {
    const noLink = await Link.findById(808);

    expect(noLink).toEqual(null);
  });

  it('finds all the links', async() => {
    await Promise.all([
      Link.insert({
        url: 'https://inspirobot.me/'
      }, ['apple']),
      Link.insert({
        url: 'https://twitter.com/home'
      }, ['banana']),
      Link.insert({
        url: 'https://github.com/',
      }, ['pineapple'])
    ]);

    const links = await Link.find();

    expect(links).toEqual(expect.arrayContaining([
      { id: expect.any(String), url: 'https://inspirobot.me/', cool: 'apple' },
      { id: expect.any(String), url: 'https://twitter.com/home', cool: 'banana' },
      { id: expect.any(String), url: 'https://github.com/', cool: 'pineapple' }
    ]));
  });

  it('updates link by id', async() => {
    const alphaLink = await Link.insert({
      url: 'https://inspirobot.me/'
    }, ['apple']);

    const betaLink = await Link.updateCool(alphaLink.id, 'banana'
    );

    expect(betaLink).toEqual({
      id: alphaLink.id,
      url: 'https://inspirobot.me/',
      cool: 'banana'
    });
  });

  it('deletes link by id', async() => {
    const createdLink = await Link.insert({
      url: 'https://inspirobot.me/'
    }, ['banana']);

    const deletedLink = await Link.delete(createdLink.id);

    expect(deletedLink).toEqual({
      id: createdLink.id,
      url: 'https://inspirobot.me/',
      cool: 'banana'
    });
  });

});
