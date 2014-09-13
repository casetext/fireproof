
'use strict';

module.exports = function(Fireproof) {


  function OnDisconnect(ref) {
    this._od = ref.onDisconnect();
  }


  OnDisconnect.prototype.cancel = function(cb) {

    var handler = Fireproof._handleError(cb);

    this._od.cancel(handler);

    return handler.promise;

  };


  OnDisconnect.prototype.remove = function(cb) {

    var handler = Fireproof._handleError(cb);

    this._od.remove(handler);

    return handler.promise;

  };


  OnDisconnect.prototype.set = function(value, cb) {

    var handler = Fireproof._handleError(cb);

    this._od.set(value, handler);

    return handler.promise;

  };


  OnDisconnect.prototype.setWithPriority = function(value, priority, cb) {

    var handler = Fireproof._handleError(cb);

    this._od.setWithPriority(value, priority, handler);

    return handler.promise;

  };


  OnDisconnect.prototype.update = function(value, cb) {

    var handler = Fireproof._handleError(cb);

    this._od.update(value, handler);

    return handler.promise;

  };


  Fireproof.prototype.onDisconnect = function() {
    return new OnDisconnect(this._ref);
  };

};
