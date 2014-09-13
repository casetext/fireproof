
'use strict';

module.exports = function(Fireproof) {

  /**
   * Delegates Firebase#transaction.
   * @method Fireproof#transaction
   * @param {function} updateFunction
   * @param {function} onComplete
   * @param {boolean=} applyLocally
   * @returns {Promise} Resolves on success, rejects on failure.
   */
  Fireproof.prototype.transaction = function(updateFunction, onComplete, applyLocally) {

    var deferred = Fireproof._checkQ().defer();

    this._ref.transaction(updateFunction, function(err, committed, snap) {

      Fireproof._nextTick(function() {
        onComplete(err, committed, snap);

        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(committed, snap);
        }

      });

    }, applyLocally);

    return deferred.promise;

  };


  /**
   * Delegates Firebase#on.
   * @method Fireproof#on
   * @param {string} eventType
   * @param {function} callback
   * @param {function=} cancelCallback
   * @param {object=} context
   * @returns {function} Your callback parameter wrapped in fireproofing. Use
   * this return value, not your own copy of callback, to call .off(). It also
   * functions as a promise that resolves on success and rejects on failure.
   */
  Fireproof.prototype.on = function(eventType, callback, cancelCallback, context) {

    var deferred = Fireproof._checkQ().defer(),
      resolved = false;

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    if (typeof cancelCallback !== 'function') {
      cancelCallback = function() {};
    }

    var callbackHandler = function(snap, prev) {

      Fireproof._nextTick(function() {

        callback(snap, prev);
        if (!resolved) {
          resolved = true;
          deferred.resolve(snap, prev);
        }

      });

    }.bind(this);

    callbackHandler.then = deferred.promise.then.bind(deferred.promise);

    this._ref.on(eventType, callbackHandler, function(err) {

      Fireproof._nextTick(function() {
        cancelCallback(err);

        if (!resolved) {
          resolved = true;
          deferred.reject(err);
        }

      });

    }, context);

    return callbackHandler;

  };


  /**
   * Delegates Firebase#off.
   * @method Fireproof#off
   * @param {string} eventType
   * @param {function=} callback
   * @param {object=} context
   */
  Fireproof.prototype.off = function(eventType, callback, context) {

    this._ref.off(eventType, callback, context);

  };


  /**
   * Delegates Firebase#once.
   * @method Fireproof#once
   * @param {object} eventType
   * @param {function} successCallback
   * @param {function=} failureCallback
   * @param {object=} context
   * @returns {Promise} Resolves on success and rejects on failure.
   */
  Fireproof.prototype.once = function(eventType, successCallback, failureCallback, context) {

    var deferred = Fireproof._checkQ().defer();

    if (typeof successCallback !== 'function') {
      successCallback = function() {};
    }

    if (typeof failureCallback !== 'function') {
      failureCallback = function() {};
    }

    this._ref.once(eventType, function(snap) {

      deferred.resolve(snap);
      Fireproof._nextTick(function() {
        successCallback(snap);
      });

    }, function(err) {

      deferred.reject(err);
      Fireproof._nextTick(function() {
        failureCallback(err);
      });

    }, context);

    return deferred.promise;

  };

};
