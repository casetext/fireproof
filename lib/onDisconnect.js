
'use strict';

module.exports = function(Fireproof) {


  function OnDisconnect(ref) {
    this._od = ref.onDisconnect();
  }


  /**
   * Delegates onDisconnect()#cancel.
   * @method onDisconnect()#cancel
   * @param {function=} callback Firebase callback.
   * @returns {Promise} Resolves on success, rejects on failure.
   */
  OnDisconnect.prototype.cancel = function(cb) {

    var handler = Fireproof._handleError(cb);

    this._od.cancel(handler);

    return handler.promise;

  };


  /**
   * Delegates onDisconnect()#remove.
   * @method onDisconnect()#remove
   * @param {function=} callback Firebase callback.
   * @returns {Promise} Resolves on success, rejects on failure.
   */
  OnDisconnect.prototype.remove = function(cb) {

    var handler = Fireproof._handleError(cb);

    this._od.remove(handler);

    return handler.promise;

  };


  /**
   * Delegates onDisconnect()#set.
   * @method onDisconnect()#set
   * @param {*} value Value to set on the ref on disconnect.
   * @param {function=} callback Firebase callback.
   * @returns {Promise} Resolves on success, rejects on failure.
   */
  OnDisconnect.prototype.set = function(value, cb) {

    var handler = Fireproof._handleError(cb);

    this._od.set(value, handler);

    return handler.promise;

  };


  /**
   * Delegates onDisconnect()#setWithPriority.
   * @method onDisconnect()#setWithPriority
   * @param {*} value Value to set on the ref on disconnect.
   * param {*} priority Priority to set on the ref on disconnect.
   * @param {function=} callback Firebase callback.
   * @returns {Promise} Resolves on success, rejects on failure.
   */
  OnDisconnect.prototype.setWithPriority = function(value, priority, cb) {

    var handler = Fireproof._handleError(cb);

    this._od.setWithPriority(value, priority, handler);

    return handler.promise;

  };


  /**
   * Delegates onDisconnect()#update.
   * @method onDisconnect()#update
   * @param {*} value Value to update on the ref on disconnect.
   * @param {function=} callback Firebase callback.
   * @returns {Promise} Resolves on success, rejects on failure.
   */
  OnDisconnect.prototype.update = function(value, cb) {

    var handler = Fireproof._handleError(cb);

    this._od.update(value, handler);

    return handler.promise;

  };


  Fireproof.prototype.onDisconnect = function() {
    return new OnDisconnect(this._ref);
  };

};
