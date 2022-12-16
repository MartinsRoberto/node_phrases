const express = require('express')
const router = express.Router()
const PhrasesController = require('../controllers/PhrasesController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, PhrasesController.add)
router.post('/add', checkAuth, PhrasesController.addPost)

router.get('/dashboard', checkAuth, PhrasesController.dashboard)

router.get('/edit/:id', checkAuth, PhrasesController.edit)
router.post('/edit', checkAuth, PhrasesController.editPost)

router.get('/remove/:id', checkAuth, PhrasesController.remove)

module.exports = router