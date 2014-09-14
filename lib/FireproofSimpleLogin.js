
'use strict';

// this library can't be used from inside Node. It's therefore really hard to
// test. Fortunately it just wraps FirebaseSimpleLogin and uses _handleError
// to wrap error callbacks

var Fireproof = require('./Fireproof');


function FireproofSimpleLogin(fslClient) {
  this._client = fslClient;
}


FireproofSimpleLogin.prototype.login = function(provider, options) {
  return this._client.login(provider, options);
};


FireproofSimpleLogin.prototype.logout = function() {
  return this._client.logout();
};


FireproofSimpleLogin.prototype.createUser = function(email, password, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.createUser(email, password, handler);

  return handler.promise;

};


FireproofSimpleLogin.prototype.changePassword = function(email, oldP, newP, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.changePassword(email, oldP, newP, handler);

  return handler.promise;

};


FireproofSimpleLogin.prototype.sendPasswordResetEmail = function(email, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.sendPasswordResetEmail(email, Fireproof._handleError(cb));

  return handler.promise;

};


FireproofSimpleLogin.prototype.removeUser = function(email, password, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.removeUser(email, password, cb);

  return handler.promise;

};


module.exports = FireproofSimpleLogin;
