
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

Fireproof.defer = function() {

  if (Fireproof.Q === undefined) {
    throw new Error('You must supply a Promise library to Fireproof by calling Fireproof.bless()!');
  }

  if (typeof Fireproof.Q.defer === 'function') {
    return Fireproof.Q.defer();
  } else {

    var deferred = {};

    deferred.promise = new Fireproof.Q(function(resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    return deferred;

  }

};

/**
 * Tell Fireproof to use a given function to set timeouts from now on.
 * NB: If you are using AMD/require.js, you MUST call this function!
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

  var deferred = Fireproof.defer();

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
      deferred.reject(err);
    } else {
      deferred.resolve(val);
    }

  };

  rv.promise = deferred.promise;

  return rv;

};


/**
 * Tell Fireproof to use a given promise library from now on.
 * @method Fireproof.bless
 * @param {Q} Q a Q-style promise constructor with mandatory .all() and optional defer().
 * @throws if you don't provide a valid promise library.
 */
Fireproof.bless = function(newQ) {

  function assert(value) {
    if (!value) {
      throw new Error('You tried to give Fireproof an invalid promise constructor!');
    }
  }

  assert(newQ !== null);
  assert(typeof newQ.all === 'function');
  if (typeof newQ.defer === 'function') {
    var deferred = newQ.defer();
    assert(typeof deferred.promise.then === 'function');
    assert(typeof deferred.resolve === 'function');
    assert(typeof deferred.reject === 'function');
  } else {
    assert(typeof newQ === 'function');
    var promise = new newQ(function () {});
    assert(typeof promise.then === 'function');
    assert(typeof promise.catch === 'function');
  }

  Fireproof.Q = newQ;

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
