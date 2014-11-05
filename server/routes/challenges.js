/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var routeHelper = require('./routeHelper');
var clientHelper = require('./clientHelper');
var localFileUploader = require('./localUploadMiddleware');
var config = require("../../config/config");
var Challenge = require('../challenge-consumer').Challenge;


// Challenge client for Swagger Challenge class
var client = new Challenge(config.challenge.apiUrl);


/**
 * Challenge resource
 */

// API methods for challenge
var challengeApiMethods = {
  all: client.getChallenges,
  create: client.postChallenges,
  get: client.getChallengesByChallengeId,
  update: client.putChallengesByChallengeId,
  delete: client.deleteChallengesByChallengeId
};
// build challenge controller
var challengeController = clientHelper.buildClientController(challengeApiMethods);

// custom routes
router.route('/configuration')
  .get(getChallengeConfiguration, routeHelper.renderJson);
router.route('/:challengeId/launch')
  .post(launchChallenge, challengeController.update, routeHelper.renderJson);

// build routes for challenge
clientHelper.buildRoutes(router, challengeController, '/', 'challengeId');

// launch challenge, change the status to active
function launchChallenge(req, res, next) {
  // challenge is in req.body
  req.body.status = 'SUBMISSION';
  next();
}

// get challenge configuration
function getChallengeConfiguration(req, res, next) {
  req.data = config.challenge;
  next();
}


/**
 * Requirement resource
 */

// API methods for requirement
var requirementApiMethods = {
  all: client.getChallengesByChallengeIdRequirements,
  create: client.postChallengesByChallengeIdRequirements,
  get: client.getChallengesByChallengeIdRequirementsByRequirementId,
  update: client.putChallengesByChallengeIdRequirementsByRequirementId,
  delete: client.deleteChallengesByChallengeIdRequirementsByRequirementId
};
// build requirement controller
var requirementController = clientHelper.buildClientController(requirementApiMethods);
// build routes for requirement
clientHelper.buildRoutes(router, requirementController, '/:challengeId/requirements', 'requirementId');


/**
 * File resource
 */

// API methods for file
var fileApiMethods = {
  all: client.getChallengesByChallengeIdFiles,
  create: client.postChallengesByChallengeIdFiles,
  get: client.getChallengesByChallengeIdFilesByFileId,
  update: client.putChallengesByChallengeIdFilesByFileId,
  delete: client.deleteChallengesByChallengeIdFilesByFileId
};
// build file controller
var fileController = clientHelper.buildClientController(fileApiMethods);

// build routes for file
clientHelper.buildRoutes(router, fileController, '/:challengeId/files', 'fileId');

router.route('/:challengeId/uploadfile')
  .post(localFileUploader.handleUpload, routeHelper.renderJson);


/**
 * Participant resource
 */

// API methods for participant
var participantApiMethods = {
  all: client.getChallengesByChallengeIdParticipants,
  create: client.postChallengesByChallengeIdParticipants,
  get: client.getChallengesByChallengeIdParticipantsByParticipantId,
  update: client.putChallengesByChallengeIdParticipantsByParticipantId,
  delete: client.deleteChallengesByChallengeIdParticipantsByParticipantId
};
// build participant controller
var participantController = clientHelper.buildClientController(participantApiMethods);
// build routes for participant
clientHelper.buildRoutes(router, participantController, '/:challengeId/participants', 'participantId');


/**
 * Submission resource
 */

// API methods for submission
var submissionApiMethods = {
  all: client.getChallengesByChallengeIdSubmissions,
  create: client.postChallengesByChallengeIdSubmissions,
  get: client.getChallengesByChallengeIdSubmissionsBySubmissionId,
  update: client.putChallengesByChallengeIdSubmissionsBySubmissionId,
  delete: client.deleteChallengesByChallengeIdSubmissionsBySubmissionId
};
// build submission controller
var submissionController = clientHelper.buildClientController(submissionApiMethods);
// build routes for submission
clientHelper.buildRoutes(router, submissionController, '/:challengeId/submissions', 'submissionId');


/**
 * Scorecard resource
 */

// API methods for scorecard
var scorecardApiMethods = {
  all: client.getChallengesByChallengeIdScorecards,
  create: client.postChallengesByChallengeIdScorecards,
  get: client.getChallengesByChallengeIdScorecardsByScorecardId,
  update: client.putChallengesByChallengeIdScorecardsByScorecardId,
  delete: client.deleteChallengesByChallengeIdScorecardsByScorecardId
};
// build scorecard controller
var scorecardController = clientHelper.buildClientController(scorecardApiMethods);
// build routes for scorecard
clientHelper.buildRoutes(router, scorecardController, '/:challengeId/scorecards', 'scorecardId');


/**
 * ScorecardItem resource
 */

// API methods for scorecardItem
var scorecardItemApiMethods = {
  all: client.getChallengesByChallengeIdScorecardsByScorecardIdScorecardItems,
  create: client.postChallengesByChallengeIdScorecardsByScorecardIdScorecardItems,
  get: client.getChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId,
  update: client.putChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId,
  delete: client.deleteChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId
};
// build scorecardItem controller
var scorecardItemController = clientHelper.buildClientController(scorecardItemApiMethods);
// build routes for scorecardItem
clientHelper.buildRoutes(router, scorecardItemController, '/:challengeId/scorecards/:scorecardId/scorecardItems', 'scorecardItemId');


module.exports = router;
