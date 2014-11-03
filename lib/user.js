
/**
 * Delegates Firebase#createUser.
 * @method Fireproof#createUser
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.createUser = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.createUser(credentials, oc);
  return oc.promise;

};


/**
 * Delegates Firebase#changePassword.
 * @method Fireproof#changePassword
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.changePassword = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.changePassword(credentials, oc);
  return oc.promise;

};


/**
 * Delegates Firebase#resetPassword.
 * @method Fireproof#resetPassword
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.resetPassword = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.resetPassword(credentials, oc);
  return oc.promise;

};


/**
 * Delegates Firebase#removeUser.
 * @method Fireproof#createUser
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @returns {Promise}
 */
Fireproof.prototype.removeUser = function(credentials, onComplete) {

  var oc = Fireproof._handleError(onComplete);
  this._ref.removeUser(credentials, oc);
  return oc.promise;

};
