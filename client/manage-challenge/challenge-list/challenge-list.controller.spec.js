describe('Unit: ChallengeListController', function() {
  var ctrl, scope, tcUrls;

  beforeEach(module('manageChallenge'));  

  var challenges = [
    {
      "id": 1,
      "name": "Asteroid Data Hunter - System Architecture",
      "account": {
        "id": "a1",
        "name": "IQSS-NTL"
      }
    },
    {
      "id": 2,
      "name": "Google Domain Custom Dashboard Architecture",
      "account": {
        "id": "a2",
        "name": "Acme"
      },
      "lastUpdatedAt": "2014/09/30 3:34 PM",
      "status": "Submission"
    }
  ];

  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, TC_URLS) {

   tcUrls = TC_URLS;

    // Create the controller
    ctrl = $controller('ChallengeListController as vm', {
      $scope: $rootScope.$new(),
      //challenges come in via resolve
      resolvedChallenges: challenges
    });
  }));  

  /** Tests */

  it('loads all challenges', 
    function() {
      expect(ctrl.challenges.length).toEqual(challenges.length);
  });  

  it('by default user agent is not a phone', 
    function() {
      expect(ctrl.phone).toBe(false);
  });  

  it('by default browser to be chrome', 
    function() {
      expect(ctrl.browser).toBe('chrome');
  });  

  it('should provide the correct url to the challenge details page on the tc site', 
    function() {      
      expect(ctrl.tcChallengeDetailsURL(challenges[0])).toEqual(tcUrls.baseDetailsURL + challenges[0].id);
  });  

})