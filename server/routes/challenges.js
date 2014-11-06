/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var express = require('express');
var router = express.Router();
var routeHelper = require('./routeHelper');
var controllerHelper = require('./controllerHelper');
var config = require('config');
/**
 * Upload middleware
 * @type {Object}
 */
var uploadMiddleware;

/**
 * Initializing upload middleware based on configuration for storage provider
 */
var storageProviders = config.storageProviders,
  providerName = config.uploads.storageProvider;

if(storageProviders.hasOwnProperty(providerName)) {
  var providerConfig = storageProviders[providerName];
  uploadMiddleware = require(config.root + '/' + providerConfig.path)(providerConfig.options, config);
} else {
  throw new Error(providerName + 'is not configured in Storage Providers');
}

// mock challenge controller
var challengeJsonFile = routeHelper.EDIT_DATA_PATH+'/challenges.json';
var challengeController = controllerHelper.buildController('Challenge', null, challengeJsonFile);

router.route('/')
  .get(challengeController.all, routeHelper.renderJson)
  .post(challengeController.create, routeHelper.renderJson);
router.route('/:challengeId')
  .get(challengeController.get, routeHelper.renderJson)
  .put(challengeController.update, routeHelper.renderJson)
  .delete(challengeController.delete, routeHelper.renderJson);
router.route('/:challengeId/launch')
  .post(challengeController.get, launchChallenge, challengeController.update, routeHelper.renderJson);

// mock requirement controller
var requirementJsonFile = routeHelper.EDIT_DATA_PATH+'/requirements.json';
var requirementController = controllerHelper.buildController('Requirement', 'Challenge', requirementJsonFile);

router.route('/:challengeId/requirements')
  .get(requirementController.all, routeHelper.renderJson)
  .post(requirementController.create, routeHelper.renderJson);
router.route('/:challengeId/requirements/:requirementId')
  .get(requirementController.get, routeHelper.renderJson)
  .put(requirementController.update, routeHelper.renderJson)
  .delete(requirementController.delete, routeHelper.renderJson);


// mock file controller
var fileJsonFile = routeHelper.EDIT_DATA_PATH+'/files.json';
var fileController = controllerHelper.buildController('File', 'Challenge', fileJsonFile);

router.route('/:challengeId/files')
  .get(fileController.all, routeHelper.renderJson)
  .post(uploadMiddleware.handleUpload, fileController.create, routeHelper.renderJson);
router.route('/:challengeId/files/:fileId')
  .get(fileController.get, routeHelper.renderJson)
  .put(fileController.update, routeHelper.renderJson)
  .delete(fileController.delete, routeHelper.renderJson);


// mock prize controller
var prizeJsonFile = routeHelper.EDIT_DATA_PATH+'/prizes.json';
var prizeController = controllerHelper.buildController('Prize', 'Challenge', prizeJsonFile);
router.route('/:challengeId/prizes')
  .get(prizeController.all, routeHelper.renderJson)
  .post(prizeController.create, routeHelper.renderJson);
router.route('/:challengeId/prizes/:prizeId')
  .get(prizeController.get, routeHelper.renderJson)
  .put(prizeController.update, routeHelper.renderJson)
  .delete(prizeController.delete, routeHelper.renderJson);


// launch challenge, change the status to active
function launchChallenge(req, res, next) {
  // challenge is in req.data
  var challenge = req.data;
  challenge.status = 'Active';
  req.body = challenge;
  next();
}


module.exports = router;
