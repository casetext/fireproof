
/**
 * Delegates Firebase#transaction.
 * @method Fireproof#transaction
 * @param {function} updateFunction
 * @param {function} onComplete
 * @param {boolean=} applyLocally
 * @returns {Promise} an Object with two properties: 'committed' and 'snapshot'.
 */
Fireproof.prototype.transaction = function(updateFunction, onComplete, applyLocally) {

  var deferred = Fireproof.defer(),
    self = this;

  var id = Fireproof.stats._start('transaction', self);

  try {
    self._ref.transaction(updateFunction, function(err, committed, snap) {

      Fireproof.stats._finish(id, err);
      snap = new Fireproof.Snapshot(snap);

      if (onComplete) {
        onComplete(err, committed, snap);
      }

      if (err) {
        deferred.reject(err);
      } else {

        deferred.resolve({
          committed: committed,
          snapshot: snap
        });

      }

    }, applyLocally);
  } catch(e) {
    deferred.reject(e);
  }

  return deferred.promise;

};


/**
 * Delegates Firebase#on.
 * @method Fireproof#on
 * @param {string} eventType 'value', 'child_added', 'child_changed', 'child_moved',
 * or 'child_removed'
 * @param {function} callback
 * @param {function=} cancelCallback
 * @param {object=} context
 * @returns {function} Your callback parameter wrapped in fireproofing. Use
 * this return value, not your own copy of callback, to call .off(). It also
 * functions as a promise that resolves with a {FireproofSnapshot}.
 */
Fireproof.prototype.on = function(eventType, callback, cancelCallback, context) {

  var deferred = Fireproof.defer(),
    resolved = false,
    finished = false,
    self = this;

  var id = Fireproof.stats._start('read', self);
  Fireproof.stats._startListener(self);

  if (!self._ids) {
    self._ids = [];
  }

  if (!self._ids[eventType]) {
    self._ids[eventType] = [];
  }

  self._ids[eventType].push(id);

  if (typeof callback !== 'function') {
    callback = function() {};
  }

  if (typeof cancelCallback !== 'function') {
    cancelCallback = function() {};
  }

  var callbackHandler = function(snap, prev) {

    if (!finished) {
      finished = true;
      self._ids[eventType].pop();
      Fireproof.stats._finish(id);
    }

    snap = new Fireproof.Snapshot(snap);

    callback(snap, prev);
    if (!resolved) {
      resolved = true;
      deferred.resolve(snap, prev);
    }

  };

  callbackHandler.then = deferred.promise.then.bind(deferred.promise);

  self._ref.on(eventType, callbackHandler, function(err) {

    self._ids[eventType].pop();
    Fireproof.stats._finish(id, err);
    Fireproof.stats._endListener(self, err);

    cancelCallback(err);

    if (!resolved) {
      resolved = true;
      deferred.reject(err);
    }

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

  if (this._ids && this._ids[eventType] && this._ids[eventType].length > 0) {
    Fireproof.stats._finish(this._ids[eventType].pop());
  }

  Fireproof.stats._endListener(this);
  this._ref.off(eventType, callback, context);

};


/**
 * Delegates Firebase#once.
 * @method Fireproof#once
 * @param {object} eventType 'value', 'child_added', 'child_changed', 'child_moved',
 * or 'child_removed'
 * @param {function} successCallback
 * @param {function=} failureCallback
 * @param {object=} context
 * @returns {Promise} Resolves with {FireproofSnapshot}.
 */
Fireproof.prototype.once = function(eventType, successCallback, failureCallback, context) {

  var deferred = Fireproof.defer(),
    self = this;

  var id = Fireproof.stats._start('read', self);

  if (typeof successCallback !== 'function') {
    successCallback = function() {};
  }

  if (typeof failureCallback !== 'function') {
    failureCallback = function() {};
  }

  self._ref.once(eventType, function(snap) {

    Fireproof.stats._finish(id);
    snap = new Fireproof.Snapshot(snap);

    deferred.resolve(snap);
    successCallback(snap);

  }, function(err) {

    Fireproof.stats._finish(id, err);

    deferred.reject(err);
    failureCallback(err);

  }, context);

  return deferred.promise;

};

