'use strict';

const express = require('express');

const postRequest = require('./postRequest');
const postResponse = require('./postResponse');

const router = express.Router({ mergeParams: true });

module.exports = () => {
  router.post('/response', postResponse);
  router.post('/', postRequest);

  return router;
};
