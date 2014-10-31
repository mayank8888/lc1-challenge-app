## Install

`npm install`

~~`cd client && bower install`~~

>npm install will now call postinstall script which will run bower install

start with `grunt` or `node server/web.js`

## Run

start with `grunt` or `node server/web.js`

## Heroku
add buildpack for node and grunt
`heroku config:set BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git`

## client generation from swagger, both node and angular services

1.  add npm modules required for code gen  

 ```
  "grunt": "^0.4.5",
    "grunt-swagger-js-codegen": "^0.2.11",
    "load-grunt-tasks": "^1.0.0",
```
2.  Create Grunt file
3. run `grunt swagger-clients`


## tc-auth
 you must supply enviromental varaibles for both  `TC_AUTH0_CLIENT` and `TC_AUTH0_SECRET` you can set them to any value for the time being until we have the config dir set up
 ```export TC_AUTH0_CLIENT=foo```
 ```export TC_AUTH0_SECRET=bar```


 > grunt has been added to the app so you can now start it with `grunt` and nodemon will watch for changes in *.js or *.html files and restart if they change
