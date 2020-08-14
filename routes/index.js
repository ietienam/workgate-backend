/* eslint-disable prettier/prettier */
const express = require('express');
const index = require('../controllers/index');

const router = express.Router();

router.get('/', index);

module.exports = router;