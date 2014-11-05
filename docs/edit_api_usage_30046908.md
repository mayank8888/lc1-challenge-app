# [[serenity] challenge edit app Real Data](http://community.topcoder.com/tc?module=ProjectDetail&pj=30046908)


## App Demo Screencasts

[App Demo Screencast](https://www.youtube.com/watch?v=sX2nnFyFFTI)


[Configuration and Code Walkthrough](https://www.youtube.com/watch?v=UR5EujlU2cM)


## Configuration

The configurations are set up in `config/config.js`.

* **oauth0** the oauth0 related configuration, not used currently
  * **client** oauth client
  * **secret** oauth secret
* **challenge** the challenge service related configuration
  * **apiUrl** the URL of lc challenge service
  * **defaultTitle** the default title of new challenge

Create `upload` folder in the project root folder where files are uploaded to. The default path for the uploaded file is `upload/challenges/:challengeId/filename`.

Copy `env_sample` to `.env`, and export the environment variables:

	$ export .env

## Local Deployment

Unzip the project zip file:

    $ unzip lc1-challenge-app.zip
    $ cd lc1-challenge-app
	
Install modules:

    $ npm install

Run the application:

	$ node server/web.js

The application starts at port 8000 by default, visit `http://localhost:8000`.

If there is any missing javascript or css file, please run `bower install` at the `client` folder.

	$ bower install

## Implementation

Implemented all requirements mentioned in the challenge. Here are summary.

#### server-side modifications

Changed all existing challenges routes to use new Swagger client, and created the reusable helper methods for creating a controller and building CRUD routes for a resource, the adding routes for new resource can be done with a few lines of code in one minute. The helper methods are in `server/routes/clientHelper.js`. Here is an example of challenge resource.

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
	
	// build routes for challenge
	clientHelper.buildRoutes(router, challengeController, '/', 'challengeId');


#### client-side modification

* Modified the client-side to use the real challenge APIs and real data.

* Fixed prize section to reorder the prizes when it loses a focus, not the value changes.

* Refactored the repeative code with function

## Recommendations

* Merge manage and edit app:

  Two applications should be merged into single AngularJS application, create states/templates for listing challenges, creating, viewing, editing challenge. If it stays same as currently, then recommend to use ui-router and Restangular in manage app.

   
* The create API should return the created resource:
 
  Current it returns id only, so the client has to query the data again, it requires two API calls. This can be done in one API call by returning the newly created resource in create API. The same theory applies to the update API.


* Recommend to use [AngularJS-Toaster](https://github.com/jirikavi/AngularJS-Toaster) for client side notisfication.

* The same Resource definition is used for creating and getting.
  For example the same `RequirementResource` is used for creating and getting. This makes `challengeId` required in the create method, this is not good. A different resource should be used since required data are different.

* Recommend to use `node-env-file` over `config`, the `node-env-file` can handle environment variables.

## Git file changes


