
function OnDisconnect(ref) {
  this._od = ref.onDisconnect();
}


/**
 * Delegates onDisconnect()#cancel.
 * @method Fireproof#onDisconnect#cancel
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.cancel = function(cb) {

  var handler = Fireproof._handleError(cb);
  this._od.cancel(handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#remove.
 * @method Fireproof#onDisconnect#remove
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.remove = function(cb) {

  var handler = Fireproof._handleError(cb);
  this._od.remove(handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#set.
 * @method Fireproof#onDisconnect#set
 * @param {*} value Value to set on the ref on disconnect.
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.set = function(value, cb) {

  var handler = Fireproof._handleError(cb);
  this._od.set(value, handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#setWithPriority.
 * @method Fireproof#onDisconnect#setWithPriority
 * @param {*} value Value to set on the ref on disconnect.
 * @param {*} priority Priority to set on the ref on disconnect.
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.setWithPriority = function(value, priority, cb) {

  var handler = Fireproof._handleError(cb);
  this._od.setWithPriority(value, priority, handler);
  return handler.promise;

};


/**
 * Delegates onDisconnect()#update.
 * @method Fireproof#onDisconnect#update
 * @param {*} value Value to update on the ref on disconnect.
 * @param {function=} callback Firebase callback.
 * @returns {Promise}
 */
OnDisconnect.prototype.update = function(value, cb) {

  var handler = Fireproof._handleError(cb);
  this._od.update(value, handler);
  return handler.promise;

};

/**
 * Delegates Fireproof#onDisconnect.
 * @method Fireproof#onDisconnect
 * @returns {Fireproof.OnDisconnect}
 */
Fireproof.prototype.onDisconnect = function() {
  return new OnDisconnect(this._ref);
};

