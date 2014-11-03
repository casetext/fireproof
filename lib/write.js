
/**
 * Delegates Firebase#set.
 * @method Fireproof#set
 * @param {object} value The value to set this path to.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 * @example
 * ```js
 * fireproofRef.set('something')
 * .then(function()) {
 *   console.log('set was successful!');
 * }, function(err) {
 *   console.error('error while setting:', err);
 * });
 * ```
 */
Fireproof.prototype.set = function(value, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  Fireproof.stats._record('write', this.toString());
  this._ref.set(value, handler);

  return handler.promise;

};


/**
 * Delegates Firebase#update.
 * @method Fireproof#update
 * @param {object} value An object with keys and values to update.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.update = function(value, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  Fireproof.stats._record('update', this.toString());
  this._ref.update(value, handler);

  return handler.promise;

};


/**
 * Delegates Firebase#remove.
 * @method Fireproof#remove
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.remove = function(onComplete) {

  var handler = Fireproof._handleError(onComplete);

  Fireproof.stats._record('write', this.toString());
  this._ref.remove(handler);

  return handler.promise;

};


/**
 * Delegates Firebase#push.
 * @method Fireproof#push
 * @param {object} value An object with keys and values to update.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.push = function(value, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  Fireproof.stats._record('write', this.toString());

  var rv = new Fireproof(
    this._ref.push(value, handler),
    handler.promise
  );

  return rv;

};


/**
 * Delegates Firebase#setWithPriority.
 * @method Fireproof#setWithPriority
 * @param {object} value The value to set this path to.
 * @param {object} priority The priority to set this path to.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.setWithPriority = function(value, priority, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  Fireproof.stats._record('write', this.toString());
  this._ref.setWithPriority(value, priority, handler);

  return handler.promise;

};


/**
 * Delegates Firebase#setPriority.
 * @method Fireproof#setPriority
 * @param {object} priority The priority to set this path to.
 * @param {function=} onComplete Callback when the operation is done.
 * @returns {Promise}
 */
Fireproof.prototype.setPriority = function(priority, onComplete) {

  var handler = Fireproof._handleError(onComplete);

  Fireproof.stats._record('write', this.toString());
  this._ref.setPriority(priority, handler);

  return handler.promise;

};

