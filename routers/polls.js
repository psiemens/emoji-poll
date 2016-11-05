var express = require('express');
var router = express.Router();

var API = require('../controllers/polls');

router.get('/:slug', API.viewPoll);

module.exports = router;
