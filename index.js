
'use strict';

/**
 * Fireproofs an existing Firebase reference, giving it magic promise powers.
 * @name Fireproof
 * @constructor
 * @global
 * @param {Firebase} firebaseRef A Firebase reference object.
 * @property then A promise shortcut for .once('value'),
 * except for references created by .push(), where it resolves on success
 * and rejects on failure of the property object.
 * @example
 * var fp = new Fireproof(new Firebase('https://test.firebaseio.com/something'));
 * fp.then(function(snap) { console.log(snap.val()); });
 */
function Fireproof(firebaseRef, promise) {

  if (!Fireproof.Promise) {

    try {
      Fireproof.Promise = Promise;
    } catch(e) {
      throw new Error('You must supply a Promise library to Fireproof!');
    }

  }

  this._ref = firebaseRef;
  if (promise && promise.then) {
    this.then = promise.then.bind(promise);
  } else {

    this.then = function(ok, fail) {

      return this.once('value', function() {})
      .then(ok || null, fail || null);

    };

  }

}

/**
 * Tell Fireproof to use a given defer-style promise library from now on.
 * If you have native promises, you don't need to call this;
 * if you want to substitute a different promise constructor, just set it on Fireproof.Promise directly.
 * @deprecated
 * @method Fireproof.bless
 * @param {Function} Deferrable a deferrable promise constructor with .all().
 * @throws if you don't provide a valid promise library.
 */
Fireproof.bless = function(Deferrable) {
  
  Fireproof.Promise = function(fn) {

    var deferred = Deferrable.defer();
    this.then = deferred.promise.then.bind(deferred.promise);
    fn(deferred.resolve.bind(deferred), deferred.reject.bind(deferred));
    
  };

  Fireproof.Promise.all = Deferrable.all;
  Fireproof.Promise.resolve = function(value) {
    return new Fireproof.Promise(function(resolve) {
      resolve(value);
    });
  };
  Fireproof.Promise.reject = function(value) {
    return new Fireproof.Promise(function(resolve, reject) {
      reject(value);
    });
  };


};

/**
 * Tell Fireproof to use a given function to set timeouts from now on.
 * @method Fireproof.setNextTick
 * @param {Function} nextTick a function that takes a function and
 * runs it in the immediate future.
 */
Fireproof.setNextTick = function(fn) {
  Fireproof.__nextTick = fn;
};


Fireproof._nextTick = function(fn) {

  if (Fireproof.__nextTick) {
    Fireproof.__nextTick(fn, 0);
  } else {
    setTimeout(fn, 0);
  }

};


Fireproof._handleError = function(onComplete) {

  var resolve, reject;
  var promise = new Fireproof.Promise(function(_resolve_, _reject_) {
    resolve = _resolve_;
    reject = _reject_;
  });

  var rv = function(err, val) {

    var context = this,
      rvArgs = arguments;


    // finish stats event, if there is one.
    if (rv.id) {
      Fireproof.stats._finish(rv.id, err);
    }

    if (onComplete && typeof onComplete === 'function') {

      Fireproof._nextTick(function() {
        onComplete.apply(context, rvArgs);
      });

    }

    if (err) {
      reject(err);
    } else {
      resolve(val);
    }

  };

  rv.promise = promise;

  return rv;

};


/**
 * Delegates Firebase#child, wrapping the child in fireproofing.
 * @method Fireproof#child
 * @param {string} childPath The subpath to refer to.
 * @returns {Fireproof} A reference to the child path.
 */
Fireproof.prototype.child = function(childPath) {
  return new Fireproof(this._ref.child(childPath));
};


/**
 * Delegates Firebase#parent, wrapping the child in fireproofing.
 * @method Fireproof#parent
 * @returns {Fireproof} A ref to the parent path, or null if there is none.
 */
Fireproof.prototype.parent = function() {

  if (this._ref.parent() === null) {
    return null;
  } else {
    return new Fireproof(this._ref.parent());
  }

};


/**
 * Delegates Firebase#root, wrapping the root in fireproofing.
 * @method Fireproof#root
 * @returns {Fireproof} A ref to the root.
 */
Fireproof.prototype.root = function() {
  return new Fireproof(this._ref.root());
};


/**
 * Hands back the original Firebase reference.
 * @method Fireproof#toFirebase
 * @returns {Firebase} The proxied Firebase reference.
 */
Fireproof.prototype.toFirebase = function() {
  return this._ref;
};


/**
 * Delegates Firebase#name.
 * @method Fireproof#name
 * @returns {string} The last component of this reference object's path.
 */
Fireproof.prototype.name = function() {
  return this._ref.name();
};


/**
 * Delegates Firebase#key.
 * @method Fireproof#key
 * @returns {string} The last component of this reference object's path.
 */
Fireproof.prototype.key = function() {
  return this._ref.key();
};


/**
 * Delegates Firebase#toString.
 * @method Fireproof#toString
 * @returns {string} The full URL of this reference object.
 */
Fireproof.prototype.toString = function() {
  return this._ref.toString();
};
