const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Pagina bienvenida
router.get('/', (req, res) => res.render('welcome'));

module.exports = router;