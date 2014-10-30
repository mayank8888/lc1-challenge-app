## Install

`npm install`

`cd client && bower install`

## Run

`node sever/web.js`


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
