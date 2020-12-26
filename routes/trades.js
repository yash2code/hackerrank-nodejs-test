var express = require('express')
var router = express.Router()
const trades = require('../controllers/trades')

// Routes related to trades
router.get('/', (req, res) => {
  trades
    .getAll(req)
    .then((e) => res.json(e))
    .catch(() => res.sendStatus(400))
})

router.post('/', (req, res) => {
  trades
    .add(req)
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(400))
})

router.get('/users/:userID', (req, res) => {
  trades
    .user(req, req.params.userID)
    .then((e) => res.json(e))
    .catch((err) => {
      if (err === 404) return res.sendStatus(404)
      res.sendStatus(400)
    })
})

module.exports = router
