'use strict';


module.exports = function(grunt) {

  grunt.initConfig({


    'swagger-js-codegen': {
      options: {
        apis: [
        {
          swagger: 'http://lc1-challenge-service.herokuapp.com/api-docs', // The location of the swagger file
          moduleName: 'challenge-consumer', // The name of the file and class
          className: 'Challenge',
        },
        {
          swagger: 'http://lc1-challenge-service.herokuapp.com/api-docs', // The location of the swagger file
          moduleName: 'challenge-service', // The name of the file and class
          className: 'Challenge',
          angularjs: true
        },
        {
          swagger: 'http://lc1-discussion-service.herokuapp.com/api-docs', // The location of the swagger file
          moduleName: 'discussion-consumer', // The name of the file and class
          className: 'Discussion',
        },
        {
          swagger: 'http://lc1-discussion-service.herokuapp.com/api-docs', // The location of the swagger file
          moduleName: 'discussion-service', // The name of the file and class
          className: 'Discussion',
          angularjs: true
        }],
        dest: 'swagger-clients' // Where the file should be generated.
      },
      dist: {

      }
    }


  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);


  //grunt.registerTask('default', ['swagger-js-codegen']);

  grunt.registerTask('default', function() {

  });



  // generate swagger clients
  grunt.registerTask('swagger-clients', 'generate challenge angular service', function () {
    grunt.task.run('swagger-js-codegen');
  });


};
