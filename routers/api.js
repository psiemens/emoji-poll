var express = require('express');
var router = express.Router();

var API = require('../controllers/api');

router.get('/incoming',  API.getIncoming);
router.post('/incoming', API.postIncoming);

router.get('/polls',  API.listPolls);
router.post('/polls', API.createPoll);

router.get('/polls/:slug/map', API.getMapData);

module.exports = router;
