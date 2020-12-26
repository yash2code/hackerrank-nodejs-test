var express = require('express')
var router = express.Router()
const stocks = require('../controllers/stocks')

// Routes related to stocks
router.get('/:symbol/trades', (req, res) => {
  stocks
    .filterByStockSymbol(req, req.params.symbol)
    .then((e) => res.json(e))
    .catch(() => res.sendStatus(404))
})

router.get('/:symbol/price', (req, res) => {
  stocks
    .filterByPrice(req, req.params.symbol)
    .then((e) => res.json(e))
    .catch(() => res.sendStatus(404))
})

module.exports = router
