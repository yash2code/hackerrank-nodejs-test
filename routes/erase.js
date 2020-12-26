var express = require('express')
var router = express.Router()
const trades = require('../controllers/trades')

// Route to delete all trades
router.delete('/', (req, res) => {
  trades
    .remove(req)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400))
})

module.exports = router
