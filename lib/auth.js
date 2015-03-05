
function findOptions(onComplete, options) {

  if (typeof onComplete !== 'function' && typeof(options) === undefined) {
    return onComplete;
  } else {
    return options;
  }

}

/**
 * Delegates Firebase#auth.
 * @method Fireproof#auth
 * @param {String} authToken
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.auth = function(authToken, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);

  this._wrapAuth(function() {
    this._ref.auth(authToken, oc, options);
    return oc.promise;
  });

  return oc.promise;

};

/**
 * Delegates Firebase#authWithCustomToken.
 * @method Fireproof#authWithCustomToken
 * @param {String} authToken
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithCustomToken = function(authToken, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);

  this._wrapAuth(function() {
    this._ref.authWithCustomToken(authToken, oc, options);
    return oc.promise;
  });

  return oc.promise;

};


/**
 * Delegates Firebase#authAnonymously.
 * @method Fireproof#authAnonymously
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authAnonymously = function(onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);

  this._wrapAuth(function() {
    this._ref.authAnonymously(oc, options);
  });

  return oc.promise;

};


/**
 * Delegates Firebase#authWithPassword.
 * @method Fireproof#authWithPassword
 * @param {Object} credentials Should include `email` and `password`.
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithPassword = function(credentials, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);

  this._wrapAuth(function() {
    this._ref.authWithPassword(credentials, oc, options);
    return oc.promise;
  });

  return oc.promise;

};


/**
 * Delegates Firebase#authWithOAuthPopup.
 * @method Fireproof#authWithOAuthPopup
 * @param {String} provider
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithOAuthPopup = function(provider, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);

  this._wrapAuth(function() {
    this._ref.authWithOAuthPopup(provider, oc, options);
    return oc.promise;
  });

  return oc.promise;

};


/**
 * Delegates Firebase#authWithOAuthRedirect.
 * @method Fireproof#authWithOAuthRedirect
 * @param {String} provider
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithOAuthRedirect = function(provider, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);

  this._wrapAuth(function() {
    this._ref.authWithOAuthRedirect(provider, oc, options);
    return oc.promise;
  });

  return oc.promise;

};


/**
 * Delegates Firebase#authWithOAuthPopup.
 * @method Fireproof#authWithOAuthPopup
 * @param {String} provider
 * @param {Object} credentials
 * @param {Function} [onComplete]
 * @param {Object} [options]
 * @returns {Promise} that resolves on auth success and rejects on auth failure.
 */
Fireproof.prototype.authWithOAuthToken = function(provider, credentials, onComplete, options) {

  var oc = Fireproof._handleError(onComplete);
  options = findOptions(onComplete, options);

  this._wrapAuth(function() {
    this._ref.authWithOAuthToken(provider, credentials, oc, options);
    return oc.promise;
  });

  return oc.promise;

};


/**
 * Delegates Firebase#getAuth.
 * @method Fireproof#getAuth
 * @returns {Object} user info object, or null otherwise.
 */
Fireproof.prototype.getAuth = function() {
  return this._ref.getAuth();
};


/**
 * Delegates Firebase#onAuth.
 * @method Fireproof#onAuth
 * @param {Function} onComplete Gets called on auth change.
 * @param {Object} [context]
 */
Fireproof.prototype.onAuth = function(onComplete, context) {
  return this._ref.onAuth(onComplete, context);
};


/**
 * Delegates Firebase#offAuth.
 * @method Fireproof#offAuth
 * @param {Function} onComplete The function previously passed to onAuth.
 * @param {Object} [context]
 */
Fireproof.prototype.offAuth = function(onComplete, context) {
  return this._ref.offAuth(onComplete, context);
};


/**
 * Delegates Firebase#unauth.
 * @method Fireproof#unauth
 */
Fireproof.prototype.unauth = function() {
  return this._ref.unauth();
};

