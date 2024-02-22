const express = require('express');

const dataController = require('../controllers/data.controller');

const dataRouter = express.Router();

dataRouter.use((req, res, next) => {
  console.log('ip address:', req.ip);
  next();
});
dataRouter.post('/', dataController.postFriend);
dataRouter.get('/', dataController.getdata);
dataRouter.get('/:espId', dataController.getespID);

module.exports = dataRouter;