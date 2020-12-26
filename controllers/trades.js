const { getDB, format } = require('./utils')

module.exports = {
  getAll: (req) => {
    return new Promise((resolve, reject) => {
      const DB = getDB(req)
      DB.all('SELECT * FROM trades ORDER BY id', (err, res) => {
        if (err) return reject(err)
        resolve(res.map(format))
      })
    })
  },

  add: (req) => {
    return new Promise((resolve, reject) => {
      const DB = getDB(req)
      const statement = DB.prepare(
        'INSERT INTO trades (id, type, user_id, user_name, symbol, shares, price, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          req.body.id,
          req.body.type,
          req.body.user.id,
          req.body.user.name,
          req.body.symbol,
          req.body.shares,
          req.body.price,
          req.body.timestamp,
        ]
      )

      DB.all('SELECT id FROM trades WHERE id = ? LIMIT 1', (err, res) => {
        if (err) return reject(err)
        if (res.length > 0) return reject()
        statement.run((err) => {
          if (err) return reject(err)
          resolve()
        })
      })
    })
  },
  user: (req, userID) => {
    return new Promise((resolve, reject) => {
      const DB = getDB(req)
      const statement = DB.prepare(
        `SELECT * FROM trades WHERE user_id = ? ORDER BY id`
      )
      statement.all(userID, (err, res) => {
        if (err) return reject(err)
        if (res.length === 0) return reject(404)
        resolve(res.map(format))
      })
    })
  },
  remove: (req) => {
    return new Promise((resolve, reject) => {
      const DB = getDB(req)
      DB.run('DELETE FROM trades; VACUUM;', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  },
}
