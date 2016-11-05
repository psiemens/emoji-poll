var express = require('express');
var router = express.Router();

var API = require('../controllers/api');

router.get('/', API.home);

router.get('/incoming', API.getIncoming);
router.post('/incoming', API.postIncoming);

module.exports = router;
