
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


var Q;

Fireproof._checkQ = function() {

  if (Q === undefined) {
    throw new Error('You must supply a Defer-style promise library to Fireproof!');
  }

  return Q;

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
  } else if (root.process && root.process.nextTick) {
    root.process.nextTick(fn);
  } else {
    setTimeout(fn, 0);
  }

};


Fireproof._handleError = function(onComplete) {

  var deferred = Fireproof._checkQ().defer();

  var rv = function(err, val) {

    if (onComplete && typeof onComplete === 'function') {

      Fireproof._nextTick(function() {
        onComplete(err);
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
 * @param {Q} Q a Q-style promise constructor with at least defer().
 * @throws if you don't provide a valid Deferred-style promise library.
 */
Fireproof.bless = function(newQ) {

  if (newQ === undefined || newQ === null || typeof(newQ.defer) !== 'function') {
    throw new Error('You tried to give Fireproof an invalid Q library!');
  }

  var deferred = newQ.defer();

  if (deferred === undefined || deferred === null ||
    deferred.promise === undefined || deferred.promise === null ||
    typeof(deferred.reject) !== 'function' ||
    typeof(deferred.resolve) !== 'function' ||
    typeof(deferred.promise.then) !== 'function') {
    throw new Error('You tried to give Fireproof an invalid Q library!');
  }

  Q = newQ;

};


/* FIXME(goldibex): Find out the reason for this demonry.
 * For reasons completely incomprehensible to me, some type of race condition
 * is possible if multiple Fireproof references attempt authentication at the
 * same time, the result of which is one or more of the promises will never
 * resolve.
 * Accordingly, it is necessary that we wrap authentication actions in a
 * global lock. This is accomplished using setInterval. No, I don't like it
 * any more than you do.
 */
var authing = false;

/**
 * Delegates Firebase#auth.
 * @method Fireproof#auth
 * @param {string} authToken Firebase authentication token.
 * @param {function=} onComplete Callback on initial completion.
 * @param {function=} onCancel Callback if we ever get disconnected.
 * @returns {Promise} Resolves on success, rejects on failure.
 */
Fireproof.prototype.auth = function(authToken, onComplete, onCancel) {

  var deferred = Fireproof._checkQ().defer(),
    self = this;

  var authIntervalId = setInterval(function() {

    if (!authing) {

      authing = true;
      self._ref.auth(authToken, function(err, info) {

        authing = false;
        clearInterval(authIntervalId);
        if (err !== null) {
          deferred.reject(err);
        } else {
          deferred.resolve(info);
        }

        if (typeof onComplete === 'function') {
          Fireproof._nextTick(function() {
            onComplete(err, info);
          });
        }

      }, onCancel);

    }

  }, 1);

  return deferred.promise;

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
 * Delegates Firebase#toString.
 * @method Fireproof#toString
 * @returns {string} The full URL of this reference object.
 */
Fireproof.prototype.toString = function() {
  return this._ref.toString();
};

module.exports = Fireproof;
