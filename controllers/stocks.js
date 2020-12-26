const { getDB, format } = require('./utils')

module.exports = {
  filterByStockSymbol: (req, symbol) => {
    return new Promise((resolve, reject) => {
      const DB = getDB(req)
      const { type, start, end } = req.query
      const statement = DB.prepare(
        `SELECT * FROM trades WHERE symbol = ? AND type = ? AND timestamp BETWEEN date(?) AND date(?, '+1 day') ORDER BY id`,
        [symbol, type, start, end]
      )
      DB.get(
        'SELECT id FROM trades WHERE symbol = ? LIMIT 1',
        symbol,
        (err, res) => {
          if (err) return reject(err)
          if (!res) return reject(404)
          statement.all((err, res) => {
            if (err) return reject(err)
            resolve(res.map(format))
          })
        }
      )
    })
  },
  filterByPrice: (req, symbol) => {
    return new Promise((resolve, reject) => {
      const DB = getDB(req)
      const { type, start, end } = req.query
      const statement = DB.prepare(
        `SELECT symbol, MIN(price), MAX(price), COUNT(id) FROM trades WHERE symbol=? AND timestamp BETWEEN date(?) AND date(?, '+1 day')`,
        [symbol, start, end]
      )
      DB.get(
        `SELECT id FROM trades WHERE symbol=? LIMIT 1`,
        symbol,
        (err, res) => {
          if (err) return reject(err)
          if (!res) return reject(404)
          statement.get((err, res) => {
            if (err) return reject(err)
            if (!res.symbol)
              return resolve({
                message: 'There are no trades in the given date range',
              })
            resolve({
              symbol: res.symbol,
              highest: res['MAX(price)'],
              lowest: res['MIN(price)'],
            })
          })
        }
      )
    })
  },
}
