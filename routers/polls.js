var express = require('express');
var router = express.Router();

var API = require('../controllers/polls');

router.get('/:slug', API.viewPoll);
router.get('/:slug/map', API.viewMap);

module.exports = router;
