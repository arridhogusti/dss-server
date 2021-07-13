var firstRoute = require('./db.json');
var profile = require('./profile.json');
var questionnaire = require('./questionnaire.json');

module.exports = function () {
  return {
    ...firstRoute,
    ...profile,
    ...questionnaire,
  }
}
