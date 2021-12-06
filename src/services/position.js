const DatabaseInstance = require("../utils/DatabaseInstance");

class PositionService {
  constructor() {
    this.db = new DatabaseInstance("/tmp/database.sqlite3");
    this.createTable();
  }

  async createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS positions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          entryPrice FLOAT,
          symbol TEXT,
          leverage INT,
          type TEXT,
          active BOOLEAN,
          createdAt DATETIME
          )`;
    return await this.db.run(sql);
  }

  async getById(id) {
    return await this.db.get(`SELECT * FROM positions WHERE id = ?`, [id]);
  }

  async getActive(symbol) {
    return await this.db.get(
      `SELECT * FROM positions WHERE active = true and symbol = ? order by id desc`,
      [symbol]
    );
  }

  async getActives() {
    return await this.db.all(`SELECT * FROM positions WHERE active = true`);
  }

  async getAll() {
    return await this.db.all(`SELECT * FROM positions`);
  }

  async create(input) {
    return await this.db.run(
      "INSERT INTO positions (entryPrice, symbol, leverage, type, active, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        input.entryPrice,
        input.symbol,
        input.leverage,
        input.type,
        input.active,
        input.createdAt,
      ]
    );
  }

  async update(input) {
    return await this.db.run(
      `UPDATE positions SET entryPrice = ?, leverage = ? WHERE id = ?`,
      [input.entryPrice, input.leverage, input.id]
    );
  }

  async changeStatus(input) {
    return await this.db.run(`UPDATE positions SET active = ? WHERE id = ?`, [
      input.active,
      input.id,
    ]);
  }

  async truncate() {
    return await this.db.run(`DELETE from positions;`);
  }

  async drop() {
    return await this.db.run(`DROP table positions;`);
  }
}

module.exports = PositionService;
