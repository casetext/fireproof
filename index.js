
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define([], factory);
  } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory();
  } else {
      // Browser globals (root is window)
      root.returnExports = factory();
  }

}(this, function () {

  var nextTick = function(fn) {

      if (typeof setImmediate !=='undefined') {
        setImmediate(fn);
      } else if (typeof process !== 'undefined' && process.nextTick) {
        process.nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }

  };

  var handleErr = function(promise, onComplete) {

    return function(err) {

      promise(err === null);

      if (typeof onComplete === 'function') {

        nextTick(function() {
          onComplete(err);
        });

      }
    };

  };

  var library = {};
  /* jshint ignore:start */
  (function(target) {

    var undef;

    function isFunction(f) {
      return typeof f == 'function';
    }
    function isObject(f) {
      return typeof f == 'object';
    }
    function defer(callback) {
      if (typeof setImmediate != 'undefined')
        setImmediate(callback);
      else if (typeof process != 'undefined' && process['nextTick'])
        process['nextTick'](callback);
      else
        setTimeout(callback, 0);
    }

    target[0][target[1]] = function pinkySwear(extend) {
      var state;           // undefined/null = pending, true = fulfilled, false = rejected
      var values = [];     // an array of values as arguments for the then() handlers
      var deferred = [];   // functions to call when set() is invoked

      var set = function(newState, newValues) {
        if (state == null && newState != null) {
          state = newState;
          values = newValues;
          if (deferred.length)
            defer(function() {
              for (var i = 0; i < deferred.length; i++)
                deferred[i]();
            });
        }
        return state;
      };

      set['then'] = function (onFulfilled, onRejected) {
        var promise2 = pinkySwear(extend);
        var callCallbacks = function() {
            try {
              var f = (state ? onFulfilled : onRejected);
              if (isFunction(f)) {
                function resolve(x) {
                  var then, cbCalled = 0;
                  try {
                    if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
                      if (x === promise2)
                        throw new TypeError();
                      then['call'](x,
                        function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
                        function(value){ if (!cbCalled++) promise2(false,[value]);});
                    }
                    else
                      promise2(true, arguments);
                  }
                  catch(e) {
                    if (!cbCalled++)
                      promise2(false, [e]);
                  }
                }
                resolve(f.apply(undef, values || []));
              }
              else
                promise2(state, values);
          }
          catch (e) {
            promise2(false, [e]);
          }
        };
        if (state != null)
          defer(callCallbacks);
        else
          deferred.push(callCallbacks);
        return promise2;
      };
          if(extend){
              set = extend(set);
          }
      return set;
    };
  })([library, 'pinkySwear']);
  /* jshint ignore:end */

  var pinkySwear = library.pinkySwear;

  function Fireproof(firebaseRef, promise) {

    this._ref = firebaseRef;
    if (promise && promise.then) {
      this.then = promise.then.bind(promise);
    } else {
      this.then = pinkySwear();
      this.then(true);
    }

  }

  Fireproof.prototype.auth = function(authToken, onComplete, onCancel) {

    var promise = pinkySwear();

    this._ref.auth(token, function(err, info) {

      if (err !== null) {
        promise(false, [err]);
      } else {
        promise(true, [info]);
      }

      if (typeof onComplete === 'function') {
        nextTick(function() {
          onComplete(err, info);
        });
      }

    }, onCancel);

    return promise;

  };


  Fireproof.prototype.unauth = function() {
    this._ref.unauth();
  };


  Fireproof.prototype.child = function(childPath) {
    return new Fireproof(this._ref.child(childPath));
  };


  Fireproof.prototype.parent = function() {
    return new Fireproof(this._ref.parent());
  };


  Fireproof.prototype.root = function() {

    var root = this._ref.root();
    if (root) {
      return new Fireproof(root);
    } else {
      return null;
    }

  };


  Fireproof.prototype.name = function() {
    return this._ref.name();
  };


  Fireproof.prototype.toString = function() {
    return this._ref.toString();
  };


  Fireproof.prototype.set = function(value, onComplete) {

    var promise = pinkySwear();

    this._ref.set(value, handleError(promise, onComplete));

    return promise;

  };


  Fireproof.prototype.update = function(value, onComplete) {

    var promise = pinkySwear();

    this._ref.update(value, handleError(promise, onComplete));

    return promise;

  };


  Fireproof.prototype.remove = function(onComplete) {

    var promise = pinkySwear();

    this._ref.remove(handleError(promise, onComplete));

    return promise;

  };


  Fireproof.prototype.push = function(value, onComplete) {

    var promise = pinkySwear();

    var rv = new Fireproof(
      this._ref.push(value, handleError(promise, onComplete)),
      promise
    );

    return promise;

  };


  Fireproof.prototype.setWithPriority = function(value, priority, onComplete) {

    var promise = pinkySwear();

    this._ref.setWithPriority(value, priority, handleError(promise, onComplete));

    return promise;

  };


  Fireproof.prototype.setPriority = function(priority, onComplete) {

    var promise = pinkySwear();

    this._ref.setPriority(priority, handleError(promise, onComplete));

    return promise;

  };


  Fireproof.prototype.transaction = function(updateFunction, onComplete, applyLocally) {

    var promise = pinkySwear();

    this._ref.transaction(updateFunction, function(err, committed, snap) {

      nextTick(function() {
        onComplete(err, committed, snap);
      });

      if (err) {
        promise(false, [err]);
      } else {
        promise(true, [committed, snap]);
      }

    }, applyLocally);

    return promise;

  };


  Fireproof.prototype.on = function(eventType, callback, cancelCallback, context) {

    var promise = pinkySwear();

    return this._ref.on(eventType, function(snap) {

      promise(true, [snap]);
      nextTick(function() {
        callback(snap);
      });

    }.bind(this), function(err) {

      promise(false, [err]);
      nextTick(function() {
        cancelCallback(err);
      });

    }.bind(this), context);

  };


  Fireproof.prototype.off = function(eventType, callback, context) {

    this._ref.off(eventType, callback, context);

  };


  Fireproof.prototype.once = function(eventType, successCallback, failureCallback, context) {

    var promise = pinkySwear();

    this._ref.once(eventType, function(snap) {

      promise(true, [snap]);
      nextTick(function() {
        callback(snap);
      });

    }.bind(this), function(err) {

      promise(false, [err]);
      nextTick(function() {
        cancelCallback(err);
      });

    }.bind(this), context);

     return promise;

   };


  Fireproof.prototype.limit = function(limit) {
    return new Fireproof(this._ref.limit(limit));
  };


  Fireproof.prototype.startAt = function(priority, name) {
    return new Fireproof(this._ref.startAt(priority, name));
  };


  Fireproof.prototype.endAt = function(priority, name) {
    return new Fireproof(this._ref.endAt(priority, name));
  };


  Fireproof.prototype.equalTo = function(priority, name) {
    return new Fireproof(this._ref.equalTo(priority, name));
  };


  Fireproof.prototype.ref = function() {
    return new Fireproof(this._ref());
  };



  return Fireproof;

}));
