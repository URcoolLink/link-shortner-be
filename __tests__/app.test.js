const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Link = require('../lib/model/link.js');

describe('link-shortener routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('tests that a new short link is created in database using POST route', async() => {
    const response = await request(app)
      .post('/api/v1/links')
      .send({
        url: 'https://inspirobot.me/'
      });

    expect(response.body).toEqual({
      id: expect.any(String),
      url: 'https://inspirobot.me/',
      cool: expect.any(String)
    });
  });

  it('finds the cool word by id from database using GET route', async() => {
    const newLink = await Link.insert({
      url: 'https://inspirobot.me/'
    }, ['apple']);

    const response = await request(app)
      .get(`/${newLink.cool}`);

    expect(response.redirect).toBeTruthy;
  });

  it('gets all the links in the database using the GET route', async() => {
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

    const response = await request(app)
      .get('/api/v1/links');
    
    expect(response.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        url: 'https://inspirobot.me/',
        cool: expect.any(String)
      }, {
        id: expect.any(String),
        url: 'https://twitter.com/home',
        cool: expect.any(String)
      }, {
        id: expect.any(String),

        url: 'https://github.com/',
        cool: expect.any(String)
      }
    ]));
  });

  it('updates the shortened URL with a new short URL using a put route', async() => {
    const newLink = await Link.insert({
      url: 'https://inspirobot.me/'
    }, ['apple']);

    const response = await request(app)
      .patch(`/api/v1/links/${newLink.id}`);
      

    expect(response.body).toEqual({
      id: expect.any(String),
      url: 'https://inspirobot.me/',
      cool: expect.any(String)
    });
  });

  it('deletes a URL using DELETE route', async() => {
    const newLink = await Link.insert({
      url: 'https://inspirobot.me/'
    }, ['apple']);

    const response = await request(app)
      .delete(`/api/v1/links/${newLink.id}`);

    expect(response.body).toEqual({
      id: expect.any(String),
      url: 'https://inspirobot.me/',
      cool: expect.any(String)
    });
  });
});


