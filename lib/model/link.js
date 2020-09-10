const pool = require('../utils/pool');

class Link {
  id;
  url;
  cool;

  constructor(row) {
    this.id = row.id;
    this.url = row.url;
    this.cool = row.cool;
  }

  static async insert(link, word) {
    const { rows } = await pool.query(
      'INSERT INTO links (url, cool) VALUES ($1, $2) RETURNING *',
      [link.url, word[0]]
    );

    return new Link(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM links WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Link(rows[0]);
  }

  static async findUrlByCool(cool) {
    const { rows } = await pool.query(
      'SELECT url FROM links WHERE cool = $1',
      [cool]
    );

    if(!rows[0]) return null;
    else return rows[0].url;
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM links'
    );

    return rows.map(row => new Link(row));
  }

  static async updateCool(id, cool) {
    const { rows } = await pool.query(
      `UPDATE links
      SET cool=$1
      WHERE id = $2
      RETURNING *
      `,
      [cool, id]
      
    );
    console.log(Object.values(rows[0]));
    return new Link(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM links WHERE id = $1 RETURNING *',
      [id]
    );

    return new Link(rows[0]);
  }

}

module.exports = Link;
