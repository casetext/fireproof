
'use strict';

// this library can't be used from inside Node. It's therefore really hard to
// test. Fortunately it just wraps FirebaseSimpleLogin and uses _handleError
// to wrap error callbacks

var Fireproof = require('./Fireproof');


function FireproofSimpleLogin(fslClient) {
  this._client = fslClient;
}


/**
 * Delegates FirebaseSimpleLogin#login.
 * @method FireproofSimpleLogin#login
 * @param {string} provider Login provider to use ('password', etc.)
 * @param {Object} options Login options, (rememberMe, etc.)
 * @returns {Promise} Resolves on success, rejects on failure.
 */
FireproofSimpleLogin.prototype.login = function(provider, options) {
  return this._client.login(provider, options);
};


/**
 * Delegates FirebaseSimpleLogin#logout.
 * @method FireproofSimpleLogin#logout
 */
FireproofSimpleLogin.prototype.logout = function() {
  return this._client.logout();
};


/**
 * Delegates FirebaseSimpleLogin#createUser.
 * @method FireproofSimpleLogin#createUser
 * @param {string} email Email to key the account on.
 * @param {string} password Password to give the new account.
 * @param {function=} cb Firebase callback.
 * @returns {Promise} Resolves on success, rejects on failure.
 */
FireproofSimpleLogin.prototype.createUser = function(email, password, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.createUser(email, password, handler);

  return handler.promise;

};


/**
 * Delegates FirebaseSimpleLogin#changePassword.
 * @method FireproofSimpleLogin#changePassword
 * @param {string} email Email to key the account on.
 * @param {string} password Password to give the new account.
 * @param {function=} cb Firebase callback.
 * @returns {Promise} Resolves on success, rejects on failure.
 */
FireproofSimpleLogin.prototype.changePassword = function(email, oldP, newP, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.changePassword(email, oldP, newP, handler);

  return handler.promise;

};


/**
 * Delegates FirebaseSimpleLogin#sendPasswordResetEmail.
 * @method FireproofSimpleLogin#sendPasswordResetEmail
 * @param {string} email Email of the account.
 * @param {function=} cb Firebase callback.
 * @returns {Promise} Resolves on success, rejects on failure.
 */
FireproofSimpleLogin.prototype.sendPasswordResetEmail = function(email, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.sendPasswordResetEmail(email, Fireproof._handleError(cb));

  return handler.promise;

};


/**
 * Delegates FirebaseSimpleLogin#removeUser.
 * @method FireproofSimpleLogin#removeUser
 * @param {string} email Email of the account.
 * @param {string} password Password of the account.
 * @param {function=} cb Firebase callback.
 * @returns {Promise} Resolves on success, rejects on failure.
 */
FireproofSimpleLogin.prototype.removeUser = function(email, password, cb) {

  var handler = Fireproof._handleError(cb);

  this._client.removeUser(email, password, cb);

  return handler.promise;

};


module.exports = FireproofSimpleLogin;
