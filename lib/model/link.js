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

  static async insert(link) {
    const { rows } = await pool.query(
      'INSERT INTO links (url, cool) VALUES ($1, $2) RETURNING *',
      [link.url, link.cool]
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

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM links'
    );

    return rows.map(row => new Link(row));
  }

  static async update(id, updatedLink) {
    const { rows } = await pool.query(
      `UPDATE links
      SET url=$1, cool=$2
      WHERE id = $3
      RETURNING *
      `,
      [updatedLink.url, updatedLink.cool, id]
    );

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
